const API_BASE = 'http://localhost:4000';

// Registration form
document.getElementById('registration-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('reg-name').value;
  const email = document.getElementById('reg-email').value;
  const accountType = document.getElementById('reg-account-type').value;
  const resultEl = document.getElementById('registration-result');

  try {
    const res = await fetch(`${API_BASE}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, accountType }),
    });

    const data = await res.json();

    if (!res.ok) {
      resultEl.textContent = `Error: ${data.error}`;
      resultEl.className = 'error';
      return;
    }

    resultEl.textContent = `User created! ID: ${data.id}`;
    resultEl.className = 'success';
  } catch (err) {
    resultEl.textContent = 'Error: could not reach server';
    resultEl.className = 'error';
  }
});

// Transaction form
document.getElementById('transaction-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const userId = document.getElementById('txn-user-id').value;
  const amount = parseFloat(document.getElementById('txn-amount').value);
  const type = document.getElementById('txn-type').value;
  const recipientId = document.getElementById('txn-recipient-id').value;
  const resultEl = document.getElementById('transaction-result');

  try {
    const res = await fetch(`${API_BASE}/api/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, amount, type, recipientId }),
    });

    const data = await res.json();

    if (!res.ok) {
      resultEl.textContent = `Error: ${data.error}`;
      resultEl.className = 'error';
      return;
    }

    resultEl.textContent = `Transaction created! ID: ${data.id}`;
    resultEl.className = 'success';
  } catch (err) {
    resultEl.textContent = 'Error: could not reach server';
    resultEl.className = 'error';
  }
});
