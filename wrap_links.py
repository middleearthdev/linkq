#!/usr/bin/env python3
"""
Script to wrap all LinkListBlock styles with LinkWrapper component
"""

import re

def wrap_link_styles(content):
    """
    Wraps all button return statements (except 'pill' which is already wrapped) with LinkWrapper
    """

    # Pattern to match style blocks that need wrapping
    # Matches: if (validatedStyle === 'xxx') { return ( <button ... > ... </button> ) }
    # But NOT the 'pill' style which is already wrapped

    lines = content.split('\n')
    result = []
    i = 0

    while i < len(lines):
        line = lines[i]

        # Check if this is a style condition (but not pill or vintage which are already wrapped)
        if "if (validatedStyle === '" in line and "pill" not in line and "vintage" not in line:
            # Found a style that needs wrapping
            result.append(line)  # Add the if statement
            i += 1

            # Next line should be "return ("
            if i < len(lines) and "return (" in lines[i]:
                result.append("        <LinkWrapper key={item.id || index}>")  # Add wrapper opening
                i += 1

                # Add the button opening tag, removing key prop
                if i < len(lines):
                    button_line = lines[i]
                    # Remove key={item.id || index} from button
                    button_line = re.sub(r'\s*key=\{item\.id \|\| index\}', '', button_line)
                    result.append(button_line)
                    i += 1

                # Copy lines until we find the closing </button>
                depth = 1
                while i < len(lines) and depth > 0:
                    current = lines[i]

                    # Check for button closing
                    if '</button>' in current:
                        result.append(current)
                        i += 1
                        # Add LinkWrapper closing
                        result.append("        </LinkWrapper>")
                        break
                    else:
                        result.append(current)
                        i += 1
                continue

        result.append(line)
        i += 1

    return '\n'.join(result)

# Read the file
with open('src/components/blocks/LinkListBlock.tsx', 'r') as f:
    content = f.read()

# Process it
wrapped_content = wrap_link_styles(content)

# Write back
with open('src/components/blocks/LinkListBlock.tsx', 'w') as f:
    f.write(wrapped_content)

print("✅ Successfully wrapped all link styles with LinkWrapper!")
