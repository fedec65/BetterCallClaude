# conftest.py - pytest configuration
# This file ensures the src directory is in the Python path for imports

import sys
from pathlib import Path

# Add the project root to the Python path
project_root = Path(__file__).parent
if str(project_root) not in sys.path:
    sys.path.insert(0, str(project_root))
