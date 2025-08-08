// Global variables
let currentQuestion = 0;
let score = 0;
let quizQuestions = [];

// Quiz questions data
const questions = [
  {
    question: "What command is used to list files and directories in Linux?",
    options: ["dir", "ls", "list", "show"],
    correct: 1
  },
  {
    question: "Which directory contains user home directories?",
    options: ["/etc", "/home", "/usr", "/var"],
    correct: 1
  },
  {
    question: "What command is used to change directories?",
    options: ["cd", "change", "dir", "move"],
    correct: 0
  },
  {
    question: "Which command shows the current working directory?",
    options: ["pwd", "cwd", "where", "current"],
    correct: 0
  },
  {
    question: "What does 'sudo' stand for?",
    options: ["Super User Do", "Switch User Do", "Super Do", "System User Do"],
    correct: 0
  },
  {
    question: "Which file permission allows execution?",
    options: ["r", "w", "x", "e"],
    correct: 2
  },
  {
    question: "What command creates a new directory?",
    options: ["mkdir", "makedir", "newdir", "createdir"],
    correct: 0
  },
  {
    question: "Which symbol represents the root directory?",
    options: ["~", "/", "\\", "root"],
    correct: 1
  },
  {
    question: "What command removes files?",
    options: ["del", "rm", "remove", "delete"],
    correct: 1
  },
  {
    question: "Which command shows file permissions?",
    options: ["ls -l", "ls -a", "ls -h", "ls -p"],
    correct: 0
  }
];

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
  initializeProgressBar();
  initializeTerminal();
  initializeQuiz();
  addSmoothScrolling();
  addCopyFunctionality();
});

// Progress bar functionality
function initializeProgressBar() {
  const progressBar = document.getElementById('progressBar');
  
  window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / scrollHeight) * 100;
    
    progressBar.style.width = scrollPercent + '%';
  });
}

// Terminal functionality
function initializeTerminal() {
  const commandInput = document.getElementById('commandInput');
  const terminalOutput = document.getElementById('terminalOutput');
  
  // Common Linux commands and their outputs
  const commands = {
    'ls': 'file1.txt  file2.txt  directory1/  directory2/',
    'ls -la': 'total 32\ndrwxr-xr-x  5 user user 4096 Jan 15 10:30 .\ndrwxr-xr-x  3 user user 4096 Jan 15 10:25 ..\n-rw-r--r--  1 user user  123 Jan 15 10:30 file1.txt\n-rw-r--r--  1 user user  456 Jan 15 10:30 file2.txt\ndrwxr-xr-x  2 user user 4096 Jan 15 10:30 directory1\ndrwxr-xr-x  2 user user 4096 Jan 15 10:30 directory2',
    'pwd': '/home/user',
    'whoami': 'user',
    'date': new Date().toString(),
    'echo "Hello World"': 'Hello World',
    'mkdir test': 'Directory created successfully',
    'help': 'Available commands: ls, pwd, whoami, date, echo, mkdir, help, clear',
    'clear': 'clear'
  };
  
  commandInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      executeCommand();
    }
  });
  
  window.executeCommand = function() {
    const command = commandInput.value.trim();
    if (!command) return;
    
    // Add command to output
    const commandLine = document.createElement('div');
    commandLine.innerHTML = `<span class="prompt">user@linux:~$</span> <span class="command">${command}</span>`;
    terminalOutput.appendChild(commandLine);
    
    // Process command
    const output = commands[command.toLowerCase()] || `Command '${command}' not found. Type 'help' for available commands.`;
    
    if (output !== 'clear') {
      const outputLine = document.createElement('div');
      outputLine.textContent = output;
      terminalOutput.appendChild(outputLine);
    } else {
      terminalOutput.innerHTML = '';
    }
    
    // Clear input
    commandInput.value = '';
    
    // Scroll to bottom
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  };
}

// Quiz functionality
function initializeQuiz() {
  quizQuestions = [...questions];
}

function startQuiz() {
  document.getElementById('quizStart').style.display = 'none';
  document.getElementById('quizContent').style.display = 'block';
  currentQuestion = 0;
  score = 0;
  showQuestion();
}

function showQuestion() {
  const question = quizQuestions[currentQuestion];
  const questionContainer = document.getElementById('questionContainer');
  const questionCounter = document.getElementById('questionCounter');
  const quizProgress = document.getElementById('quizProgress');
  
  questionCounter.textContent = `Question ${currentQuestion + 1} of ${quizQuestions.length}`;
  quizProgress.style.width = `${((currentQuestion + 1) / quizQuestions.length) * 100}%`;
  
  questionContainer.innerHTML = `
    <div class="question">
      <h3>${question.question}</h3>
      <div class="options">
        ${question.options.map((option, index) => `
          <div class="option" onclick="selectOption(${index})">
            ${option}
          </div>
        `).join('')}
      </div>
    </div>
    <button class="btn btn-primary" onclick="nextQuestion()" id="nextBtn" disabled>Next Question</button>
  `;
}

function selectOption(optionIndex) {
  const options = document.querySelectorAll('.option');
  const nextBtn = document.getElementById('nextBtn');
  
  // Remove previous selections
  options.forEach(option => option.classList.remove('selected'));
  
  // Select current option
  options[optionIndex].classList.add('selected');
  
  // Enable next button
  nextBtn.disabled = false;
}

function nextQuestion() {
  const selectedOption = document.querySelector('.option.selected');
  if (!selectedOption) return;
  
  const selectedIndex = Array.from(document.querySelectorAll('.option')).indexOf(selectedOption);
  const question = quizQuestions[currentQuestion];
  
  // Check if answer is correct
  if (selectedIndex === question.correct) {
    score++;
    selectedOption.classList.add('correct');
  } else {
    selectedOption.classList.add('incorrect');
    document.querySelectorAll('.option')[question.correct].classList.add('correct');
  }
  
  // Disable next button and change text
  const nextBtn = document.getElementById('nextBtn');
  nextBtn.textContent = currentQuestion === quizQuestions.length - 1 ? 'See Results' : 'Next Question';
  nextBtn.onclick = currentQuestion === quizQuestions.length - 1 ? showResults : nextQuestion;
  
  // Wait before proceeding
  setTimeout(() => {
    if (currentQuestion < quizQuestions.length - 1) {
      currentQuestion++;
      showQuestion();
    } else {
      showResults();
    }
  }, 1500);
}

function showResults() {
  const percentage = Math.round((score / quizQuestions.length) * 100);
  const quizContent = document.getElementById('quizContent');
  const quizResults = document.getElementById('quizResults');
  
  quizContent.style.display = 'none';
  quizResults.style.display = 'block';
  
  let message = '';
  let color = '';
  
  if (percentage >= 90) {
    message = 'Excellent! You\'re a Linux expert!';
    color = 'text-success';
  } else if (percentage >= 70) {
    message = 'Good job! You have solid Linux knowledge.';
    color = 'text-primary';
  } else if (percentage >= 50) {
    message = 'Not bad! Keep learning and practicing.';
    color = 'text-warning';
  } else {
    message = 'Keep studying! Review the material and try again.';
    color = 'text-danger';
  }
  
  quizResults.innerHTML = `
    <h3>Quiz Results</h3>
    <div class="display-4 ${color} mb-3">${percentage}%</div>
    <p class="lead">${message}</p>
    <p>You got ${score} out of ${quizQuestions.length} questions correct.</p>
    <button class="btn btn-primary" onclick="restartQuiz()">Take Quiz Again</button>
    <button class="btn btn-outline-secondary" onclick="goToLearning()">Continue Learning</button>
  `;
}

function restartQuiz() {
  document.getElementById('quizResults').style.display = 'none';
  document.getElementById('quizStart').style.display = 'block';
}

function goToLearning() {
  document.getElementById('quizResults').style.display = 'none';
  document.getElementById('intro').scrollIntoView({ behavior: 'smooth' });
}

// Script editor functionality
function runScript() {
  const scriptEditor = document.getElementById('scriptEditor');
  const scriptOutput = document.getElementById('scriptOutput');
  const script = scriptEditor.value;
  
  // Simple script execution simulation
  const lines = script.split('\n');
  let output = '';
  
  for (let line of lines) {
    line = line.trim();
    if (line.startsWith('echo')) {
      const message = line.substring(5).replace(/"/g, '');
      output += message + '\n';
    } else if (line.startsWith('#')) {
      // Comment - do nothing
    } else if (line.includes('for') && line.includes('in')) {
      output += 'Loop executed: 1 2 3 4 5\n';
    } else if (line.includes('if') && line.includes('then')) {
      output += 'Condition checked\n';
    } else if (line && !line.startsWith('#!/')) {
      output += `Executed: ${line}\n`;
    }
  }
  
  scriptOutput.textContent = output || 'Script executed successfully!';
}

function saveScript() {
  const scriptEditor = document.getElementById('scriptEditor');
  const script = scriptEditor.value;
  
  // Create download link
  const blob = new Blob([script], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'script.sh';
  a.click();
  URL.revokeObjectURL(url);
  
  alert('Script saved as script.sh');
}

function clearScript() {
  document.getElementById('scriptEditor').value = '#!/bin/bash\necho "Hello from your script!"';
  document.getElementById('scriptOutput').textContent = '';
}

// Setup guide functionality
function showSetupGuide(type) {
  const guides = {
    wsl: {
      title: 'Windows Subsystem for Linux (WSL) Setup',
      steps: [
        'Open PowerShell as Administrator',
        'Run: wsl --install',
        'Restart your computer',
        'Set up your Linux username and password',
        'Update your system: sudo apt update && sudo apt upgrade'
      ]
    },
    vm: {
      title: 'Virtual Machine Setup',
      steps: [
        'Download VirtualBox or VMware',
        'Download Ubuntu ISO from ubuntu.com',
        'Create a new virtual machine',
        'Allocate at least 2GB RAM and 20GB storage',
        'Install Ubuntu in the virtual machine'
      ]
    },
    usb: {
      title: 'USB Boot Setup',
      steps: [
        'Download Ubuntu ISO from ubuntu.com',
        'Download and install Rufus (Windows) or Etcher',
        'Insert a USB drive (at least 4GB)',
        'Use Rufus/Etcher to create bootable USB',
        'Restart computer and boot from USB'
      ]
    }
  };
  
  const guide = guides[type];
  if (!guide) return;
  
  const modal = document.createElement('div');
  modal.className = 'modal fade';
  modal.innerHTML = `
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">${guide.title}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <ol>
            ${guide.steps.map(step => `<li>${step}</li>`).join('')}
          </ol>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  const modalInstance = new bootstrap.Modal(modal);
  modalInstance.show();
  
  modal.addEventListener('hidden.bs.modal', () => {
    document.body.removeChild(modal);
  });
}

// Project guide functionality
function showProjectGuide(type) {
  const guides = {
    automation: {
      title: 'Automation Script Project',
      description: 'Create a script that automates system maintenance tasks.',
      code: `#!/bin/bash
# System maintenance automation script

echo "Starting system maintenance..."

# Update system
echo "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Clean up old packages
echo "Cleaning up old packages..."
sudo apt autoremove -y
sudo apt autoclean

# Clean log files
echo "Cleaning log files..."
sudo find /var/log -name "*.log" -mtime +7 -delete

echo "System maintenance completed!"`
    },
    webserver: {
      title: 'Web Server Setup Project',
      description: 'Set up Apache web server and host a simple website.',
      code: `#!/bin/bash
# Web server setup script

echo "Setting up Apache web server..."

# Install Apache
sudo apt update
sudo apt install apache2 -y

# Start and enable Apache
sudo systemctl start apache2
sudo systemctl enable apache2

# Create simple website
sudo mkdir -p /var/www/html
echo "<html><body><h1>Hello from Linux!</h1></body></html>" | sudo tee /var/www/html/index.html

echo "Web server setup completed!"
echo "Visit http://localhost to see your website"`
    },
    users: {
      title: 'User Management System',
      description: 'Create a script to manage user accounts and groups.',
      code: `#!/bin/bash
# User management script

echo "User Management System"
echo "1. Add user"
echo "2. Remove user"
echo "3. List users"
read -p "Choose option: " choice

case $choice in
  1)
    read -p "Enter username: " username
    sudo adduser $username
    ;;
  2)
    read -p "Enter username: " username
    sudo deluser $username
    ;;
  3)
    cut -d: -f1 /etc/passwd | sort
    ;;
  *)
    echo "Invalid option"
    ;;
esac`
    },
    backup: {
      title: 'Backup System Project',
      description: 'Create an automated backup system for important files.',
      code: `#!/bin/bash
# Backup system script

BACKUP_DIR="/home/user/backups"
SOURCE_DIR="/home/user/documents"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p $BACKUP_DIR

# Create backup
tar -czf $BACKUP_DIR/backup_$DATE.tar.gz $SOURCE_DIR

# Remove backups older than 7 days
find $BACKUP_DIR -name "backup_*.tar.gz" -mtime +7 -delete

echo "Backup completed: backup_$DATE.tar.gz"`
    }
  };
  
  const guide = guides[type];
  if (!guide) return;
  
  const modal = document.createElement('div');
  modal.className = 'modal fade';
  modal.innerHTML = `
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">${guide.title}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <p>${guide.description}</p>
          <h6>Sample Code:</h6>
          <pre><code>${guide.code}</code></pre>
          <button class="btn btn-sm btn-outline-secondary" onclick="copyCode(this)">Copy Code</button>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  const modalInstance = new bootstrap.Modal(modal);
  modalInstance.show();
  
  modal.addEventListener('hidden.bs.modal', () => {
    document.body.removeChild(modal);
  });
}

// Utility functions
function addSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

function addCopyFunctionality() {
  window.copyCode = function(button) {
    const codeBlock = button.previousElementSibling;
    const text = codeBlock.textContent;
    
    navigator.clipboard.writeText(text).then(() => {
      const originalText = button.textContent;
      button.textContent = 'Copied!';
      button.classList.remove('btn-outline-secondary');
      button.classList.add('btn-success');
      
      setTimeout(() => {
        button.textContent = originalText;
        button.classList.remove('btn-success');
        button.classList.add('btn-outline-secondary');
      }, 2000);
    });
  };
}

// Add fade-in animation to sections
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in');
    }
  });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.content-section').forEach(section => {
    observer.observe(section);
  });
}); 