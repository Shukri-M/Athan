document.addEventListener('DOMContentLoaded', () => {
    const innerCircle = document.getElementById('inner-circle');
    const progressCircle = document.getElementById('progress-circle');
    const countDisplay = document.getElementById('count');
    let count = 0;
    let rotation = 0;
  
    const totalPresses = 33; // Total number of presses to complete a full rotation
  
    function updateProgress() {
        rotation = (count / totalPresses) * 360;
        progressCircle.style.transform = `rotate(${rotation}deg) translate(100px) rotate(-${rotation}deg)`;
    }
  
    if (innerCircle) {
        innerCircle.addEventListener('click', () => {
            count++;
            countDisplay.textContent = count;
            updateProgress();
        });
    }
  
    const resetButton = document.getElementById('reset');
    if (resetButton) {
        resetButton.addEventListener('click', () => {
            count = 0;
            countDisplay.textContent = count;
            updateProgress();
        });
    }
  
    updateProgress(); // Set initial position
  });
  