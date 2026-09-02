# Bugs found

Add one section per issue. Bug 1 is filled in to show the format — fix it, then write what you changed. Copy the blank template for the rest.

Keep this file in the repo and **commit it** with your fixes.

---

## Bug 1

**How to reproduce:** When I opened the app. The expense list says “Newest first”. The first row is Wine (7 Mar). Board game (15 Mar) is further down.

**What is wrong:** The list is showing oldest expenses first. Newest should be at the top.

**What I changed:** Basically I had made changes in the dateValue function in the ExpenseList, and just flipped the order.

---

## Bug 2

**How to reproduce:** After that I looked at the Balances panel for any member who paid more than their share (e.g. Bhanu or Carlos).

**What is wrong:** Members who paid more than their share are shown in red with the label “owes $X.XX”, while members who spent less than their share are shown in green with “is owed $X.XX”. The labels and styling are inverted.

**What I changed:** I just have made a correctional conditional chjeck on BalancesPanel.jsx, so that + balance  is in owed and the - balance is in -ve.

---

## Bug 3

**How to reproduce:** I checked an expense where the payer is not included in the split, such as seed expense "Uber to airport" ($60 paid by Diya, split between Bhanu and rahul). Diya is credited only $30 instead of $60.

**What is wrong:** When someone pays for a bill they didn't consume, they should be reimbursed in full. This bug also broke the closed-group invariant where net balances across all members sum to zero.

**What I changed:** Removed the penalty check and deduction from computeBalances balances.js, so payers get full credit for payments made for others.

---

## Bug 4

**How to reproduce:** The filter section is the useless one, We cannot even use the search bar and search the user/expense details

**What is wrong:** All expenses disappear and the list displays “No expenses match these filters.”, even when that member has paid expenses in the list.

**What I changed:** I changed `e.paidBy !== paidBy` to `Number(e.paidBy) !== Number(paidBy)` to fix the type mismatch between string option values and numeric member IDs on expenses.

---

## Bug 5

**How to reproduce:** I filtered out main expenses (e.g. by category "Fun" or search query) and click "Delete" on any row, or edit the amount input.

**What is wrong:** A completely different expense is deleted or updated. 

**What I changed:** First of all let us understand the main issue, the sorted and filtered list index was passed to the reducer, which applied splice or updated <b>state.expenses[action.index]</b>. So I updated <b>DELETE_EXPENSE</b> and <b>UPDATE_EXPENSE</b> reducer cases in `src/state/store.js` to operate by expense `id`.

---

## Bug 6

**How to reproduce:** I have seen that when I created main expenses for eg: Person A owes $50 and Person B is owed $50.

**What is wrong:** The "Settle up" panel shows no transfers between them. 

**What I changed:** The issue lied on an empty `else` block when `d.amount === c.amount`..So, I restructured the loop using `Math.min(d.amount, c.amount)` to always create a transfer of the matching amount.
---

## Bug 7

**How to reproduce:** There was a amazing case when I tried to split $100 between 3 people.

**What is wrong:** Each person gets $33.33, totaling $99.99. 1 cent is lost in rounding, violating the rule that equal split shares must sum to the full bill.

**What I changed:** So, in the money.js, I updated `splitEqual` to calculate base cents and distribute remainder cents among the participants.

---

## Bug 8

**How to reproduce:** In Add Expense, just select "Custom %" with 3 members (which auto-fills 33.33%, 33.33%, 33.34%), enter description and amount, then click "Save expense".

**What is wrong:** There I saw form error actually with "Percentages must add to 100." due to floating point addition.

**What I changed:** I updated `percentsSumTo100` to allow floating-point precision tolerance, and refactored `splitByPercent` to reconcile allocated cents.

---

## Bug 9

**How to reproduce:** Main Reload the browser page after visiting the app.

**What is wrong:** `loadState` did not rehydrate persistent (continuing from a long time) data from `localStorage`.

**What I changed:** I updated `loadState` in `src/state/store.js` to call `hydrate(JSON.parse(raw))` so dates are properly restored as objects.

---

## Bug 10

**How to reproduce:** In the Summary section, add a new member name (e.g. "Maya") and click "Add".

**What is wrong:** When you will see the new member, you will realise that it does not show up in the "Paid so far" breakdown until an expense is modified.

**What I changed:** So, I Added `members` to the `useMemo` dependency list and I added a `useEffect` hook to keep `splitWith` up to date when members are added.

---

## Bug 11

**How to reproduce:** In the filter section, just search filter that only matches ddescription (mainly: Ignoring Payer & Category)

**What is wrong:** Basically, It has made static and provided a value of e.descriptin. So, I have to fix that

**What I changed:** I have to edit the src/App.jsx, tb build a member lookup map and expand the search query check,so that q matches the expense description, the name or category.

---

## Bug 12

**How to reproduce:** In the Add Expense form, select "Custom %". Then you have to move to enter a negative percentage (e.g. Member A: -20%, Member B: 120%)

**What is wrong:** You will be able to see, that the form accepted negative percentages because the sum totaled 100%, causing members to be credited rather than debited for an expense. 

**What I changed:** I updated `percentsSumTo100()` in `src/lib/money.js` to ensure all percentage values are positive (`> 0`). 


---

## Additionals
First of all make sure, if this application will scale we have to add apagination concepts in teh expenses section for low latency of the website, and that helps users to keep it self organised. The demo you gave me was very basic with statis data. For now as this has o authorization, database, I cannot suggest any of the system design concept.

### Thank you foir the assignment