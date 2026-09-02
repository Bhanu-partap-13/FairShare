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

**How to reproduce:** Check an expense where the payer is not included in the split, such as seed expense "Uber to airport" ($60 paid by Diya, split between Aisha and Ben). Diya is credited only $30 instead of $60.

**What is wrong:** `computeBalances` in `src/lib/balances.js` contains a check `!(exp.paidBy in shares)` that subtracts `amount / n` from the payer's balance. When someone pays for a bill they didn't consume, they should be reimbursed in full. This bug also broke the closed-group invariant where net balances across all members sum to zero.

**What I changed:** Removed the erroneous penalty check and deduction from `computeBalances` in `src/lib/balances.js` so payers get full credit for payments made for others.

---

## Bug 4

**How to reproduce:** In the Filter section, select any person in the "Paid by" dropdown (e.g. "Aisha Khan").

**What is wrong:** All expenses disappear and the list displays “No expenses match these filters.”, even when that member has paid expenses in the list.

**What I changed:** In `src/App.jsx`, changed `e.paidBy !== paidBy` to `Number(e.paidBy) !== Number(paidBy)` to fix the type mismatch between string option values from the `<select>` element and numeric member IDs on expenses.

---

## Bug 5

**How to reproduce:** Filter expenses (e.g. by category "Fun" or search query) and click "Delete" on any row, or edit the amount input.

**What is wrong:** A completely different expense is deleted or updated. This is because the sorted and filtered list index was passed to the reducer, which applied `splice` or updated `state.expenses[action.index]`.

**What I changed:** Updated `DELETE_EXPENSE` and `UPDATE_EXPENSE` reducer cases in `src/state/store.js` to operate by expense `id` rather than array `index`. Updated `src/App.jsx` and `src/components/ExpenseList.jsx` to pass `id` and use `key={expense.id}`.

---

## Bug 6

**How to reproduce:** Create expenses such that a debtor owes the exact same amount that a creditor is owed (for example, Person A owes $50 and Person B is owed $50).

**What is wrong:** The "Settle up" panel shows no transfers between them. The algorithm contained an empty `else` block when `d.amount === c.amount` that incremented pointers without creating a transfer.

**What I changed:** In `src/lib/settle.js`, restructured the loop using `Math.min(d.amount, c.amount)` to always create a transfer of the matching amount, ensuring no balances are dropped.

---

## Bug 7

**How to reproduce:** Inspect or record an expense whose amount cannot be split into even whole cents (such as $100 split 3 ways).

**What is wrong:** Each person gets $33.33, totaling $99.99. 1 cent is lost in rounding, violating the rule that equal split shares must sum to the full bill.

**What I changed:** In `src/lib/money.js`, updated `splitEqual` to calculate base cents and distribute remainder cents among the participants, ensuring the sum of shares always matches the total bill.

---

## Bug 8

**How to reproduce:** In Add Expense, select "Custom %" with 3 members (which auto-fills 33.33%, 33.33%, 33.34%), enter description and amount, then click "Save expense".

**What is wrong:** The form rejects submission with "Percentages must add to 100." due to floating point addition (`100.00000000000001 !== 100`). Also, dollar amounts calculated from percentages could lose cents due to independent rounding.

**What I changed:** In `src/lib/money.js`, updated `percentsSumTo100` to allow floating-point precision tolerance (`Math.abs(sum - 100) < 0.01`), and refactored `splitByPercent` to reconcile allocated cents so the shares in dollars cover the original bill amount.

---

## Bug 9

**How to reproduce:** Reload the browser page after visiting the app.

**What is wrong:** `loadState` in `src/state/store.js` did not rehydrate persisted data from `localStorage`, leaving `expense.date` as ISO string values rather than `Date` objects. This broke localized date formatting in `formatDate` and caused `NaN` in date sorting.

**What I changed:** Updated `loadState` in `src/state/store.js` to call `hydrate(JSON.parse(raw))` so dates are properly restored as `Date` objects on every reload. Also improved `formatDate` in `src/lib/format.js` to parse both string and Date objects gracefully.

---

## Bug 10

**How to reproduce:** In the Summary section, add a new member name (e.g. "Maya") and click "Add".

**What is wrong:** The new member does not show up in the "Paid so far" breakdown until an expense is modified. In addition, the Add Expense form does not include the new member in its split list, and the form retains input values after adding an expense.

**What I changed:** Added `members` to the `useMemo` dependency list in `src/components/SummaryCards.jsx`. In `src/components/AddExpenseForm.jsx`, added a `useEffect` hook to keep `splitWith` up to date when members are added, and cleared the `description` and `amount` form inputs on submission.

