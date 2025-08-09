// Global variables
let currentQuestion = 0;
let score = 0;
let quizQuestions = [];
let terminalHistory = [];
let historyIndex = -1;

// Enhanced Quiz questions data with explanations
const questions = [
  {
    question: "What command is used to list files and directories in Linux?",
    options: ["dir", "ls", "list", "show"],
    correct: 1,
    explanation: "The 'ls' command lists the contents of a directory. It's one of the most fundamental Linux commands."
  },
  {
    question: "Which directory contains user home directories?",
    options: ["/etc", "/home", "/usr", "/var"],
    correct: 1,
    explanation: "The /home directory contains individual user directories. Each user typically has a subdirectory here."
  },
  {
    question: "What command is used to change directories?",
    options: ["cd", "change", "dir", "move"],
    correct: 0,
    explanation: "The 'cd' command stands for 'change directory' and is used to navigate between directories."
  },
  {
    question: "Which command shows the current working directory?",
    options: ["pwd", "cwd", "where", "current"],
    correct: 0,
    explanation: "The 'pwd' command stands for 'print working directory' and shows your current location."
  },
  {
    question: "What does 'sudo' stand for?",
    options: ["Super User Do", "Switch User Do", "Super Do", "System User Do"],
    correct: 0,
    explanation: "'sudo' stands for 'Super User Do' and allows you to run commands with elevated privileges."
  },
  {
    question: "Which file permission allows execution?",
    options: ["r", "w", "x", "e"],
    correct: 2,
    explanation: "The 'x' permission stands for execute and allows a file to be run as a program."
  },
  {
    question: "What command creates a new directory?",
    options: ["mkdir", "makedir", "newdir", "createdir"],
    correct: 0,
    explanation: "The 'mkdir' command stands for 'make directory' and creates new directories."
  },
  {
    question: "Which symbol represents the root directory?",
    options: ["~", "/", "\\", "root"],
    correct: 1,
    explanation: "The forward slash (/) represents the root directory, which is the top-level directory in Linux."
  },
  {
    question: "What command removes files?",
    options: ["del", "rm", "remove", "delete"],
    correct: 1,
    explanation: "The 'rm' command removes (deletes) files. Be careful as this permanently deletes files."
  },
  {
    question: "Which command shows file permissions?",
    options: ["ls -l", "ls -a", "ls -h", "ls -p"],
    correct: 0,
    explanation: "The 'ls -l' command shows files in long format, including permissions, ownership, and size."
  }
];

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
  initializeProgressBar();
  initializeTerminal();
  initializeQuiz();
  addSmoothScrolling();
  addCopyFunctionality();
  initializeAnimations();
  initializeTooltips();
});

// Enhanced Progress bar functionality
function initializeProgressBar() {
  const progressBar = document.getElementById('progressBar');
  
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const scrollTop = document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / scrollHeight) * 100;
      
      progressBar.style.width = Math.min(scrollPercent, 100) + '%';
    });
  }
}

// Enhanced Terminal functionality
function initializeTerminal() {
  const commandInput = document.getElementById('commandInput');
  const terminalOutput = document.getElementById('terminalOutput');
  
  if (!commandInput || !terminalOutput) return;
  
  // Enhanced command database with realistic outputs
  const commands = {
    'ls': {
      output: 'Documents  Downloads  Pictures  Desktop  Videos  Music',
      description: 'List directory contents'
    },
    'ls -la': {
      output: `total 32
drwxr-xr-x  8 user user 4096 Jan 15 10:30 .
drwxr-xr-x  3 root root 4096 Jan 15 10:25 ..
-rw-r--r--  1 user user  220 Jan 15 10:25 .bashrc
-rw-r--r--  1 user user  807 Jan 15 10:25 .profile
drwxr-xr-x  2 user user 4096 Jan 15 10:30 Documents
drwxr-xr-x  2 user user 4096 Jan 15 10:30 Downloads
drwxr-xr-x  2 user user 4096 Jan 15 10:30 Pictures`,
      description: 'List all files with detailed information'
    },
    'ls -l': {
      output: `total 24
drwxr-xr-x  2 user user 4096 Jan 15 10:30 Documents
drwxr-xr-x  2 user user 4096 Jan 15 10:30 Downloads
drwxr-xr-x  2 user user 4096 Jan 15 10:30 Pictures
drwxr-xr-x  2 user user 4096 Jan 15 10:30 Desktop`,
      description: 'List files in long format'
    },
    'pwd': {
      output: '/home/user',
      description: 'Print working directory'
    },
    'whoami': {
      output: 'user',
      description: 'Display current username'
    },
    'date': {
      output: () => new Date().toString(),
      description: 'Display current date and time'
    },
    'echo hello': {
      output: 'hello',
      description: 'Display text'
    },
    'echo "Hello World"': {
      output: 'Hello World',
      description: 'Display text with quotes'
    },
    'mkdir test': {
      output: 'Directory "test" created successfully',
      description: 'Create directory'
    },
    'mkdir myproject': {
      output: 'Directory "myproject" created successfully',
      description: 'Create directory'
    },
    'cd ..': {
      output: 'Changed to parent directory',
      description: 'Change to parent directory'
    },
    'cd ~': {
      output: 'Changed to home directory (/home/user)',
      description: 'Change to home directory'
    },
    'cd /': {
      output: 'Changed to root directory (/)',
      description: 'Change to root directory'
    },
    'cat /etc/passwd': {
      output: `root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
bin:x:2:2:bin:/bin:/usr/sbin/nologin
sys:x:3:3:sys:/dev:/usr/sbin/nologin
user:x:1000:1000:user:/home/user:/bin/bash`,
      description: 'Display user accounts'
    },
    'uname -a': {
      output: 'Linux ubuntu 5.4.0-42-generic #46-Ubuntu SMP Fri Jul 10 00:24:02 UTC 2020 x86_64 x86_64 x86_64 GNU/Linux',
      description: 'Display system information'
    },
    'df -h': {
      output: `Filesystem      Size  Used Avail Use% Mounted on
/dev/sda1        20G  8.5G   11G  45% /
tmpfs           2.0G     0  2.0G   0% /dev/shm
/dev/sda2       100G   45G   50G  48% /home`,
      description: 'Display disk space usage'
    },
    'ps aux': {
      output: `USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
root         1  0.0  0.1 225868  9012 ?        Ss   10:25   0:01 /sbin/init
root         2  0.0  0.0      0     0 ?        S    10:25   0:00 [kthreadd]
user      1234  0.5  2.1 123456 12345 pts/0    S+   10:30   0:05 bash`,
      description: 'Display running processes'
    },
    'help': {
      output: `Available commands:
• ls [-la|-l] - List directory contents
• pwd - Print working directory
• whoami - Display current user
• date - Show current date/time
• echo [text] - Display text
• mkdir [name] - Create directory
• cd [path] - Change directory
• cat [file] - Display file contents
• uname -a - System information
• df -h - Disk space usage
• ps aux - Running processes
• history - Command history
• clear - Clear terminal
• help - Show this help`,
      description: 'Show available commands'
    },
    'history': {
      output: () => {
        if (terminalHistory.length === 0) {
          return 'No command history available';
        }
        return terminalHistory.map((cmd, index) => `${index + 1}  ${cmd}`).join('\n');
      },
      description: 'Show command history'
    },
    'clear': {
      output: 'clear',
      description: 'Clear terminal screen'
    }
  };
  
  // Handle command input
  commandInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      const command = this.value.trim();
      if (command) {
        executeTerminalCommand(command, commands, terminalOutput);
        terminalHistory.push(command);
        historyIndex = terminalHistory.length;
        this.value = '';
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex > 0) {
        historyIndex--;
        this.value = terminalHistory[historyIndex];
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex < terminalHistory.length - 1) {
        historyIndex++;
        this.value = terminalHistory[historyIndex];
      } else {
        historyIndex = terminalHistory.length;
        this.value = '';
      }
    }
  });

  // Handle execute button
  const executeBtn = document.querySelector('.terminal-input button');
  if (executeBtn) {
    executeBtn.addEventListener('click', () => {
      const command = commandInput.value.trim();
      if (command) {
        executeTerminalCommand(command, commands, terminalOutput);
        terminalHistory.push(command);
        historyIndex = terminalHistory.length;
        commandInput.value = '';
      }
    });
  }
}

// Enhanced command execution
function executeTerminalCommand(command, commands, outputElement) {
  const timestamp = new Date().toLocaleTimeString();
  
  // Add command to output
  const commandLine = document.createElement('div');
  commandLine.innerHTML = `<span class="text-success">[${timestamp}] user@linux:~$</span> <span class="text-white">${command}</span>`;
  outputElement.appendChild(commandLine);
  
  // Find and execute command
  let output = '';
  let found = false;
  
  // Check for exact match first
  if (commands[command]) {
    const cmd = commands[command];
    output = typeof cmd.output === 'function' ? cmd.output() : cmd.output;
    found = true;
  } else {
    // Check for partial matches (like echo with different text)
    for (let cmd in commands) {
      if (command.startsWith(cmd.split(' ')[0]) && cmd.includes(' ')) {
        if (command.startsWith('echo ')) {
          const text = command.substring(5).replace(/"/g, '');
          output = text;
          found = true;
          break;
        } else if (command.startsWith('mkdir ')) {
          const dirName = command.substring(6);
          output = `Directory "${dirName}" created successfully`;
          found = true;
          break;
        } else if (command.startsWith('cd ')) {
          const path = command.substring(3);
          output = `Changed directory to: ${path}`;
          found = true;
          break;
        }
      }
    }
  }
  
  if (!found) {
    output = `bash: ${command}: command not found\nType 'help' for available commands.`;
  }
  
  // Handle special commands
  if (output === 'clear') {
    outputElement.innerHTML = '';
    return;
  }
  
  // Add output
  const outputLine = document.createElement('div');
  outputLine.innerHTML = `<pre class="text-info mb-2">${output}</pre>`;
  outputElement.appendChild(outputLine);
  
  // Scroll to bottom
  outputElement.scrollTop = outputElement.scrollHeight;
}

// Enhanced Quiz functionality
function initializeQuiz() {
  const quizContainer = document.querySelector('.quiz-container');
  if (!quizContainer) return;
  
  // Add quiz progress tracking
  updateQuizProgress();
}

function startQuiz() {
  currentQuestion = 0;
  score = 0;
  const quizStart = document.getElementById('quizStart');
  const quizContent = document.getElementById('quizContent');
  
  if (quizStart && quizContent) {
    quizStart.style.display = 'none';
    quizContent.style.display = 'block';
    loadQuestion();
  }
}

function loadQuestion() {
  if (currentQuestion >= questions.length) {
    finishQuiz();
    return;
  }
  
  const question = questions[currentQuestion];
  const container = document.getElementById('questionContainer');
  
  if (container) {
    container.innerHTML = `
      <div class="question fade-in">
        <h3><i class="fas fa-question-circle text-primary me-2"></i>${question.question}</h3>
        <div class="options mt-4">
          ${question.options.map((option, index) => `
            <div class="option" onclick="selectOption(${index})" data-index="${index}">
              <span class="option-letter">${String.fromCharCode(65 + index)}</span>
              <span class="option-text">${option}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    
    updateQuizProgress();
  }
}

function selectOption(optionIndex) {
  // Remove previous selections
  document.querySelectorAll('.option').forEach(option => {
    option.classList.remove('selected');
  });
  
  // Add selection to clicked option
  const selectedOption = document.querySelector(`[data-index="${optionIndex}"]`);
  if (selectedOption) {
    selectedOption.classList.add('selected');
    
    // Enable next button
    const nextBtn = document.getElementById('nextBtn');
    const finishBtn = document.getElementById('finishBtn');
    
    if (nextBtn) nextBtn.disabled = false;
    if (finishBtn) finishBtn.disabled = false;
  }
}

function nextQuestion() {
  const selectedOption = document.querySelector('.option.selected');
  if (selectedOption) {
    const selectedIndex = parseInt(selectedOption.dataset.index);
    if (selectedIndex === questions[currentQuestion].correct) {
      score++;
    }
  }
  
  currentQuestion++;
  loadQuestion();
}

function updateQuizProgress() {
  const progressBar = document.getElementById('quizProgress');
  const questionCounter = document.getElementById('questionCounter');
  const scoreDisplay = document.getElementById('scoreDisplay');
  
  if (progressBar) {
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    progressBar.style.width = progress + '%';
  }
  
  if (questionCounter) {
    questionCounter.textContent = `Question ${currentQuestion + 1} of ${questions.length}`;
  }
  
  if (scoreDisplay) {
    scoreDisplay.textContent = `Score: ${score}/${currentQuestion}`;
  }
  
  // Show/hide finish button
  const nextBtn = document.getElementById('nextBtn');
  const finishBtn = document.getElementById('finishBtn');
  
  if (currentQuestion === questions.length - 1) {
    if (nextBtn) nextBtn.style.display = 'none';
    if (finishBtn) finishBtn.style.display = 'inline-block';
  } else {
    if (nextBtn) nextBtn.style.display = 'inline-block';
    if (finishBtn) finishBtn.style.display = 'none';
  }
}

function finishQuiz() {
  const selectedOption = document.querySelector('.option.selected');
  if (selectedOption) {
    const selectedIndex = parseInt(selectedOption.dataset.index);
    if (selectedIndex === questions[currentQuestion].correct) {
      score++;
    }
  }
  
  const quizContent = document.getElementById('quizContent');
  const quizResults = document.getElementById('quizResults');
  
  if (quizContent && quizResults) {
    quizContent.style.display = 'none';
    quizResults.style.display = 'block';
    
    const percentage = (score / questions.length) * 100;
    const passed = percentage >= 70;
    
    quizResults.innerHTML = `
      <div class="text-center fade-in">
        <h2><i class="fas fa-${passed ? 'trophy' : 'times-circle'} text-${passed ? 'success' : 'danger'} me-2"></i>Quiz Complete!</h2>
        <div class="score-display mb-4">
          <div class="score-circle ${passed ? 'passed' : 'failed'}">
            <span class="score-number">${percentage.toFixed(1)}%</span>
            <span class="score-text">${score}/${questions.length}</span>
          </div>
          <p class="lead mt-3">${passed ? 'Congratulations! You passed the quiz!' : 'Keep studying and try again!'}</p>
        </div>
        
        <div class="quiz-actions">
          <button class="btn btn-primary me-2" onclick="retakeQuiz()">
            <i class="fas fa-redo me-2"></i>Retake Quiz
          </button>
          <a href="../index.html" class="btn btn-secondary">
            <i class="fas fa-home me-2"></i>Back to Home
          </a>
        </div>
      </div>
    `;
  }
}

function retakeQuiz() {
  currentQuestion = 0;
  score = 0;
  
  const quizResults = document.getElementById('quizResults');
  const quizStart = document.getElementById('quizStart');
  
  if (quizResults && quizStart) {
    quizResults.style.display = 'none';
    quizStart.style.display = 'block';
  }
}

// Smooth scrolling
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

// Enhanced Copy functionality
function addCopyFunctionality() {
  document.querySelectorAll('.code-example').forEach(example => {
    const button = example.querySelector('button');
    if (button) {
      button.addEventListener('click', function() {
        const codeBlock = example.querySelector('pre, code');
        if (codeBlock) {
          copyToClipboard(codeBlock.textContent, this);
        }
      });
    }
  });
}

function copyToClipboard(text, button) {
  navigator.clipboard.writeText(text).then(() => {
    // Visual feedback
    const originalText = button.textContent;
    const originalClass = button.className;
    
    button.textContent = 'Copied!';
    button.className = button.className.replace('btn-outline-secondary', 'btn-success');
    
    setTimeout(() => {
      button.textContent = originalText;
      button.className = originalClass;
    }, 2000);
  }).catch(err => {
    console.error('Failed to copy text: ', err);
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
  });
}

// Initialize animations
function initializeAnimations() {
  // Add fade-in animation to elements when they come into view
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
      }
    });
  }, observerOptions);
  
  // Observe elements for animation
  document.querySelectorAll('.content-card, .feature-card, .timeline-content, .distro-card').forEach(el => {
    observer.observe(el);
  });
}

// Initialize tooltips
function initializeTooltips() {
  // Add tooltips to buttons and icons
  document.querySelectorAll('[data-tooltip]').forEach(element => {
    element.addEventListener('mouseenter', showTooltip);
    element.addEventListener('mouseleave', hideTooltip);
  });
}

function showTooltip(e) {
  const tooltip = document.createElement('div');
  tooltip.className = 'custom-tooltip';
  tooltip.textContent = e.target.dataset.tooltip;
  document.body.appendChild(tooltip);
  
  const rect = e.target.getBoundingClientRect();
  tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
  tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
}

function hideTooltip() {
  const tooltip = document.querySelector('.custom-tooltip');
  if (tooltip) {
    tooltip.remove();
  }
}

// Utility functions
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'times-circle' : 'info-circle'} me-2"></i>
    ${message}
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('show');
  }, 100);
  
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Module progress tracking
function updateModuleProgress(moduleId, progress) {
  localStorage.setItem(`module_${moduleId}_progress`, progress);
  
  // Update progress bar if on the page
  const progressBar = document.querySelector(`#module-${moduleId} .progress-bar`);
  if (progressBar) {
    progressBar.style.width = progress + '%';
    progressBar.textContent = `${progress}% Complete`;
  }
}

function getModuleProgress(moduleId) {
  return localStorage.getItem(`module_${moduleId}_progress`) || 0;
}

// Enhanced terminal clear function
function clearTerminal() {
  const terminalOutput = document.getElementById('terminalOutput');
  if (terminalOutput) {
    terminalOutput.innerHTML = '';
    showNotification('Terminal cleared', 'success');
  }
}

// Export functions for use in other scripts
window.LinuxAcademy = {
  startQuiz,
  nextQuestion,
  selectOption,
  finishQuiz,
  retakeQuiz,
  clearTerminal,
  copyToClipboard,
  showNotification,
  updateModuleProgress,
  getModuleProgress
}; 