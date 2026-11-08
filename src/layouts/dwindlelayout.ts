/*
    SPDX-FileCopyrightText: 2026 Krohnkite contributors

    SPDX-License-Identifier: MIT
*/

/**
 * Hyprland-compatible name for Krohnkite's persistent binary split layout.
 *
 * The tree implementation remains shared with BinaryTreeLayout deliberately:
 * both layouts use the same Krohnkite lifecycle, gap handling, resize path,
 * drag path and leaf-collapse rules. Keeping this as a separate class gives
 * users a Dwindle entry without changing the long-standing Binary Tree
 * layout or its shortcuts.
 */
class DwindleLayout extends BinaryTreeLayout {
  public static readonly id = "DwindleLayout";

  public readonly classID = DwindleLayout.id;

  public get description(): string {
    return "Dwindle";
  }

  /** Preserve split direction across resizes (preserve_split=true). */
  protected newWindowLocked: boolean = true;

  /**
   * Hyprland's default force_split behavior puts the new leaf on the side of
   * the selected window containing the cursor. The old leaf occupies the
   * other child and remains attached to the same parent in the tree.
   */
  protected newWindowGoesFirst(
    ctx: EngineContext,
    anchorRect: Rect,
    dir: DwindleDir,
  ): boolean {
    const cursor = ctx.cursorPos;
    if (cursor === null) return super.newWindowGoesFirst(ctx, anchorRect, dir);
    return dir === "h"
      ? cursor.x < anchorRect.x + anchorRect.width / 2
      : cursor.y < anchorRect.y + anchorRect.height / 2;
  }

  /** Hyprland's default multiplier is 1.0 and equality selects top/bottom. */
  protected newWindowDirection(anchorRect: Rect): DwindleDir {
    return anchorRect.width > anchorRect.height ? "h" : "v";
  }

  public clone(): ILayout {
    return new DwindleLayout(
      this.capacity !== undefined ? this.capacity : null,
    );
  }

  public toString(): string {
    return "DwindleLayout()";
  }
}
