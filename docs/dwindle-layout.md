# Dwindle layout

Krohnkite's `DwindleLayout` is registered separately from the existing
`BinaryTreeLayout`, but uses the same localized binary tree implementation.
This preserves the existing layout and shortcut behavior while exposing the
Hyprland-compatible name in the layout chooser and layout rotation.

The reference used for the behavior review is Hyprland 0.56.2, specifically
`src/layout/algorithm/tiled/dwindle/DwindleAlgorithm.cpp` and its companion
node implementation. The reference behavior is:

- each workspace has a binary tree of window leaves;
- a new window splits the active/cursor-selected existing leaf;
- with the default `force_split = 0`, the cursor's half determines whether the
  new leaf is the first or second child; the original window stays in the
  opposite child;
- an unlocked split is side-by-side when `width > height * split_width_multiplier`
  and top/bottom otherwise;
- `preserve_split` controls whether that orientation can change on later
  recalculations; it does not change the selected leaf or child ordering;
- the split ratio is stored on the internal node and survives recalculation;
- removing a leaf replaces its parent with the sibling;
- resize changes the nearest ancestor split that can consume the requested
  delta.

KWin does not expose Hyprland's input hit-testing, preselection dispatcher, or
native fullscreen/tree objects. Krohnkite therefore uses its focused tiled
window as the insertion anchor, uses its existing drag/drop and shortcut
interfaces for explicit moves, and keeps floating/minimized/off-surface
windows as dormant leaves until they return. `force_split`, `smart_split`,
`smart_resizing`, `split_width_multiplier`, and Hyprland's runtime layout
messages are not exposed because KWin scripting provides no equivalent input
or dispatcher contract. Gaps, padding, minimum sizes, and resize persistence
are handled by Krohnkite's existing geometry and engine abstractions.
