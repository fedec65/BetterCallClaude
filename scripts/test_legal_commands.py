#!/usr/bin/env python3
"""
Test script to verify /legal commands work correctly
Run with: python scripts/test_legal_commands.py
"""

import asyncio
import sys
from pathlib import Path

# Add project root to path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from src.core.commands import CommandRegistry


async def test_legal_help():
    """Test /legal:help command"""
    print("=" * 60)
    print("Testing /legal:help command")
    print("=" * 60)

    registry = CommandRegistry()

    # Discover and register commands
    from src.core.commands import registry as reg_module
    commands_path = Path(reg_module.__file__).parent
    count = registry.discover_commands(commands_path)
    print(f"\n✅ Discovered {count} commands")

    # Test 1: Basic help
    print("\n📝 Test 1: Basic help (no arguments)")
    result = await registry.execute("legal:help", {})
    print(f"Success: {result.get('success')}")
    print(f"Commands returned: {len(result.get('commands', []))}")

    # Test 2: Category filter
    print("\n📝 Test 2: Filter by category (research)")
    result = await registry.execute("legal:help", {"category": "research"})
    print(f"Success: {result.get('success')}")
    print(f"Research commands: {len(result.get('commands', []))}")

    # Test 3: Specific command help
    print("\n📝 Test 3: Specific command help (legal:research)")
    result = await registry.execute("legal:help", {"command": "legal:research"})
    print(f"Success: {result.get('success')}")
    if result.get('help_text'):
        print(f"Help text length: {len(result['help_text'])} characters")

    # Test 4: Verbose mode
    print("\n📝 Test 4: Verbose mode")
    result = await registry.execute("legal:help", {"verbose": True})
    print(f"Success: {result.get('success')}")
    print(f"Commands with detailed info: {len(result.get('commands', []))}")

    print("\n" + "=" * 60)
    print("✅ All /legal:help tests completed!")
    print("=" * 60)


async def test_legal_research():
    """Test /legal:research command (requires MCP servers)"""
    print("\n" + "=" * 60)
    print("Testing /legal:research command")
    print("=" * 60)

    registry = CommandRegistry()

    # Discover commands
    from src.core.commands import registry as reg_module
    commands_path = Path(reg_module.__file__).parent
    registry.discover_commands(commands_path)

    print("\n⚠️  Note: This requires MCP servers to be running")
    print("    Testing command validation only...\n")

    # Test command exists and validates arguments
    cmd = registry.get_command("legal:research")
    if cmd:
        print(f"✅ Command 'legal:research' found")
        print(f"   Category: {cmd.metadata.category.value}")
        print(f"   Description: {cmd.metadata.description}")
        print(f"   Arguments: {len(cmd.arguments)}")

        # Validate required arguments
        is_valid, error = cmd.validate_arguments({"query": "test"})
        print(f"\n✅ Validation with 'query': {is_valid}")

        # Test missing required argument
        is_valid, error = cmd.validate_arguments({})
        print(f"❌ Validation without 'query': {is_valid}")
        if error:
            print(f"   Error: {error}")
    else:
        print("❌ Command 'legal:research' not found")

    print("\n" + "=" * 60)


async def main():
    """Run all tests"""
    try:
        await test_legal_help()
        await test_legal_research()

        print("\n🎉 All tests completed successfully!")

    except Exception as e:
        print(f"\n❌ Test failed with error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(main())
