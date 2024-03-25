import logging
import traceback
import sys

# ANSI escape codes for coloring output
COLORS = {
    'GREEN': '\033[92m',  # For INFO
    'YELLOW': '\033[93m',  # For Warning
    'RED': '\033[91m',  # For ERROR
    'BLUE': '\033[34m',  # For DEBUG
    'CYAN': '\033[36m', # For general messages
    'ENDC': '\033[0m',
}

# Function to add color to the message
def add_color(text, color):
    return f"{COLORS[color]}{text}{COLORS['ENDC']}"

# Custom formatter class
class CustomFormatter(logging.Formatter):
    def format(self, record):
        # Apply color to the log level name based on the level
        levelname_color = {
            "DEBUG": 'BLUE',
            "INFO": 'GREEN',
            "ERROR": 'RED',
            "WARNING": 'YELLOW'
        }.get(record.levelname, 'ENDC')  # Default to no color if level not found

        colored_levelname = add_color(record.levelname.ljust(5), levelname_color)
        colored_message = add_color(record.getMessage(), 'CYAN')

        # Format the log message
        log_fmt = f"[{self.formatTime(record, '%H:%M:%S')}] {colored_levelname} ({record.process}): {colored_message}"

        # Include stack trace for errors
        if record.exc_info:
            tb_lines = traceback.format_exception(*record.exc_info)
            tb_text = add_color(''.join(tb_lines), 'RED')
            log_fmt += f"\n{tb_text}"

        return log_fmt

# Function to set up the custom logger
def setup_logger(name):
    logger = logging.getLogger(name)
    logger.setLevel(logging.DEBUG)
    ch = logging.StreamHandler(sys.stdout)
    ch.setLevel(logging.DEBUG)
    formatter = CustomFormatter()
    ch.setFormatter(formatter)
    logger.addHandler(ch)
    return logger

