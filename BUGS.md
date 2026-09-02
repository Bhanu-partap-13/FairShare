# Bugs found

Add one section per issue. Bug 1 is filled in to show the format — fix it, then write what you changed. Copy the blank template for the rest.

Keep this file in the repo and **commit it** with your fixes.

---

## Bug 1

**How to reproduce:** Open the app. The expense list says “Newest first”. The first row is Wine (7 Mar). Board game (15 Mar) is further down.

**What is wrong:** The list is showing oldest expenses first. Newest should be at the top.

**What I changed:** In `src/components/ExpenseList.jsx`, flipped the sort order from `dateValue(a.date) - dateValue(b.date)` to `dateValue(b.date) - dateValue(a.date)` so newest expenses sort first. In `src/lib/format.js`, updated `dateValue` to reliably convert string and Date objects to numeric timestamps.

---

## Bug 2

**How to reproduce:** Look at the Balances panel for any member who paid more than their share (e.g. Ben or Carlos).

**What is wrong:** Members who paid more than their share are shown in red with the label “owes $X.XX”, while members who spent less than their share are shown in green with “is owed $X.XX”. The labels and styling are inverted.

**What I changed:** In `src/components/BalancesPanel.jsx`, corrected the conditional check so that a positive balance (`bal > 0.005`) displays `is owed` with the green `.owed` style, and a negative balance (`bal < -0.005`) displays `owes` with the red `.owe` style.

---

## Bug 3

**How to reproduce:**

**What is wrong:**

**What I changed:**

---
