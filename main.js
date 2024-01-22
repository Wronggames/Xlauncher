javascript:(function() {
  // Define the GitHub URL at the top
  var githubRawUrl = 'GITHUB_RAW_URL';

  var style = document.createElement('style');
  style.innerHTML = `
    #transparentUI {
      position: absolute;
      top: 50px;
      left: 50px;
      width: 480px; /* Adjusted width */
      height: 360px; /* Adjusted height */
      background-color: rgba(0, 0, 0, 0.7);
      display: flex;
      flex-direction: column;
      cursor: move;
      z-index: 9999; /* Set a high z-index to appear on top */
    }

    #topBar {
      background-color: #333;
      padding: 5px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    #killButton, #minimizeButton {
      background-color: #333;
      color: white;
      padding: 5px 10px;
      font-size: 14px;
      cursor: pointer;
      border: none;
      border-radius: 5px;
    }

    #minimizeCircle {
      width: 30px;
      height: 30px;
      background-color: orange;
      border-radius: 50%;
      cursor: move;
      display: none;
      position: absolute;
      top: 50px;
      left: 50px;
      z-index: 9999;
    }

    #executeButton {
      background-color: orange;
      color: white;
      padding: 15px 30px; /* Adjusted padding */
      font-size: 18px; /* Adjusted font size */
      cursor: pointer;
      border: none;
      border-radius: 8px;
      margin-top: 20px; /* Adjusted margin top */
      align-self: center; /* Center the execute button */
    }
  `;
  document.head.appendChild(style);

  var transparentUI = document.createElement('div');
  transparentUI.id = 'transparentUI';
  
  var topBar = document.createElement('div');
  topBar.id = 'topBar';

  var killButton = document.createElement('button');
  killButton.id = 'killButton';
  killButton.innerText = '✕'; // Close (x) button

  var minimizeButton = document.createElement('button');
  minimizeButton.id = 'minimizeButton';
  minimizeButton.innerText = '—'; // Minimize button

  var minimizeCircle = document.createElement('div');
  minimizeCircle.id = 'minimizeCircle';

  var executeButton = document.createElement('button');
  executeButton.id = 'executeButton';
  executeButton.innerText = 'Execute Code';

  topBar.appendChild(killButton);
  topBar.appendChild(minimizeButton);

  transparentUI.appendChild(topBar);
  transparentUI.appendChild(executeButton);
  document.body.appendChild(transparentUI);
  document.body.appendChild(minimizeCircle);

  // Make the UI draggable
  var offsetX = 0, offsetY = 0;
  var isDragging = false;

  transparentUI.addEventListener('mousedown', function(e) {
    isDragging = true;
    offsetX = e.clientX - transparentUI.getBoundingClientRect().left;
    offsetY = e.clientY - transparentUI.getBoundingClientRect().top;
  });

  document.addEventListener('mousemove', function(e) {
    if (isDragging) {
      transparentUI.style.left = e.clientX - offsetX + 'px';
      transparentUI.style.top = e.clientY - offsetY + 'px';
    }
  });

  document.addEventListener('mouseup', function() {
    isDragging = false;
  });

  // Event listeners for buttons
  executeButton.addEventListener('click', function() {
    // Fetch code from the predefined GitHub URL and execute it
    fetch(githubRawUrl)
      .then(response => response.text())
      .then(code => {
        // Use eval() to execute the fetched code (use with caution)
        eval(code);

        // After running the code, close the UI containing the "Execute Code" button
        document.body.removeChild(transparentUI);
        // Hide the minimize circle if it's visible
        minimizeCircle.style.display = 'none';
      })
      .catch(error => console.error('Error fetching or executing code:', error));
  });

  killButton.addEventListener('click', function() {
    // Remove the transparent UI when the Kill button is clicked
    document.body.removeChild(transparentUI);
    // Hide the minimize circle if it's visible
    minimizeCircle.style.display = 'none';
  });

  minimizeButton.addEventListener('click', function() {
    // Hide the transparent UI
    transparentUI.style.display = 'none';
    // Show the minimize circle at the current position
    minimizeCircle.style.display = 'block';
    minimizeCircle.style.left = transparentUI.style.left;
    minimizeCircle.style.top = transparentUI.style.top;
  });

  // Make the minimize circle draggable
  var isMinimizeDragging = false;

  minimizeCircle.addEventListener('mousedown', function(e) {
    isMinimizeDragging = true;
    offsetX = e.clientX - minimizeCircle.getBoundingClientRect().left;
    offsetY = e.clientY - minimizeCircle.getBoundingClientRect().top;
  });

  document.addEventListener('mousemove', function(e) {
    if (isMinimizeDragging) {
      minimizeCircle.style.left = e.clientX - offsetX + 'px';
      minimizeCircle.style.top = e.clientY - offsetY + 'px';
    }
  });

  document.addEventListener('mouseup', function() {
    if (isMinimizeDragging) {
      isMinimizeDragging = false;
      // If right-clicked on the minimize circle, unminimize the UI
      document.addEventListener('contextmenu', function rightClickHandler(event) {
        event.preventDefault();
        transparentUI.style.display = 'flex';
        transparentUI.style.left = minimizeCircle.style.left;
        transparentUI.style.top = minimizeCircle.style.top;
        minimizeCircle.style.display = 'none';
        document.removeEventListener('contextmenu', rightClickHandler);
      }, { once: true });
    }
  });
})();
