# Dwindle layout

Krohnkite's `DwindleLayout` is registered separately from the existing
`BinaryTreeLayout`, but uses the same localized binary tree implementation.
This preserves the existing layout and shortcut behavior while exposing the
Hyprland-compatible name in the layout chooser and layout rotation.

The reference used for the behavior review is Hyprland 0.56.2 (rechecked
against the current `main` tree), specifically
`src/layout/algorithm/tiled/dwindle/DwindleAlgorithm.cpp` and its companion
node implementation. The reference behavior, with Hyprland's defaults
`force_split = 0`, `use_active_for_splits = true`, `preserve_split = false`,
`split_width_multiplier = 1.0` and `default_split_ratio = 1.0`, is:

- each workspace has a binary tree of window leaves;
- a new window splits the active existing leaf.  The focused window keeps its
  branch and becomes one child of the new internal node; the new window is the
  other child.  Insertion never appends to the end of a global window list;
- the cursor's half determines whether the new leaf is the first or second
  child; the original window stays in the opposite child;
- an unlocked split is side-by-side when `width > height * split_width_multiplier`
  and top/bottom otherwise;
- `preserve_split` controls whether that orientation can change on later
  recalculations; it does not change the selected leaf or child ordering;
- the split ratio is stored on the internal node and survives recalculation.
  Splitting one leaf changes only that leaf's parent and the leaves below it;
  unrelated branches and their ratios stay intact;
- removing a leaf replaces its parent with the sibling;
- resize changes the nearest ancestor split that can consume the requested
  delta.

Krohnkite's default mirrors `preserve_split = false`: an unlocked split
re-orients when the area it owns changes shape.  `Rotate` and `RotatePart`
lock the affected split so an explicit orientation survives later passes.
`force_split`, `smart_split`, `smart_resizing`, `split_width_multiplier`, and
Hyprland's runtime layout messages are not exposed because KWin scripting
provides no equivalent input or dispatcher contract.

KWin does not expose Hyprland's input hit-testing, preselection dispatcher, or
native fullscreen/tree objects. Krohnkite therefore uses its focused tiled
window as the insertion anchor, uses its existing drag/drop and shortcut
interfaces for explicit moves, and keeps floating/minimized/off-surface
windows as dormant leaves until they return. `force_split`, `smart_split`,
`smart_resizing`, `split_width_multiplier`, and Hyprland's runtime layout
messages are not exposed because KWin scripting provides no equivalent input
or dispatcher contract. Gaps, padding, minimum sizes, and resize persistence
are handled by Krohnkite's existing geometry and engine abstractions.
