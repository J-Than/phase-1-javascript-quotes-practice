// Declare global values
const dbQuotes = 'http://localhost:3000/quotes';
const dbQuery = 'http://localhost:3000/quotes?_embed=likes';
const dbLikes = 'http://localhost:3000/likes';
const dbQueryLikes = 'http://localhost:3000/likes?quoteId=';
const dbAuthorSort = 'http://localhost:3000/quotes?_sort=authorName';

// Set DOM interface values
const quoteList = document.getElementById('quote-list');
const quoteForm = document.getElementById('new-quote-form');
const quoteField = document.getElementById('new-quote');
const authorField = document.getElementById('author');

// Initialize
getQuotes();

// Fetch and populate list of quotes
function getQuotes() {
  fetch(dbQuery)
  .then(r => r.json())
  .then(s => {
    quoteList.replaceChildren();
    for (q of s) {
      let a = document.createElement('li');
        a.className = 'quote-card';
      let b = document.createElement('blockquote');
        b.className = 'blockquote';
        b.id = q.id;
      let c = document.createElement('p');
        c.className = 'mb-0';
        c.textContent = q.quote;
      let d = document.createElement('footer');
        d.className = 'blockquote-footer';
        d.textContent = q.author;
      let e = document.createElement('br');
      let f = document.createElement('button');
        f.className = 'btn btn-primary';
        f.innerHTML = `Likes: <span>${q.likes.length}</span>`;
        f.addEventListener('click', i => liker(i));
      let g = document.createElement('button');
        g.className = 'btn btn-primary';
        g.textContent = 'Delete';
        g.addEventListener('click', j => deleteQuote(j));
      let h = document.createElement('button');
        h.className = 'btn btn-primary';
        h.textContent = 'Edit';
        h.addEventListener('click', k => buildEditForm(k));
      b.appendChild(c);
      b.appendChild(d);
      b.appendChild(e);
      b.appendChild(f);
      b.appendChild(g);
      b.appendChild(h);
      a.appendChild(b);
      quoteList.appendChild(a);
    }
  })
}

// Adds a like to the selected quote
function liker(e) {
  e.preventDefault();
  fetch(dbLikes, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      quoteId: parseInt(e.target.parentElement.id, 10),
      createdAt: Math.floor(Date.now()/1000),
    })
  })
  .then(resp => getQuotes(resp));
}

// Deletes the selected quote
function deleteQuote(e) {
  e.preventDefault();
  fetch(dbQuotes + '/' + e.target.parentElement.id, {
    method: 'DELETE'
  })
  .then(resp => getQuotes(resp));
}

// Builds a form for editing the current quote
function buildEditForm(e) {
  e.preventDefault();
  const parentNode = e.target.parentElement;
  const quoteText = parentNode.firstChild.innerText;
  const authorText = parentNode.firstChild.nextSibling.innerText;
  const a = e.target.parentElement.id;
  console.log(a);
  let b = document.createElement('form');
    b.id = 'edit-quote-form';
  let c = document.createElement('div');
    c.className = 'form-group';
  let d = document.createElement('div');
    d.className = 'form-group';
  let f = document.createElement('label');
    f.htmlFor = 'edit-quote';
    f.textContent = 'Quote: ';
  let g = document.createElement('input');
    g.name = 'edit-quote';
    g.type = 'text';
    g.className = 'form-control';
    g.id = 'edit-quote';
    g.value = quoteText;
  let h = document.createElement('label');
    h.htmlFor = 'edit-author';
    h.textContent = 'Author: ';
  let i = document.createElement('input');
    i.name = 'edit-author';
    i.type = 'text';
    i.className = 'form-control';
    i.id = 'edit-author';
    i.value = authorText;
  let j = document.createElement('button');
    j.type = 'submit';
    j.className = 'btn btn-primary';
    j.textContent = 'Save';
    j.id = 'save-btn';
    j.addEventListener('click', l => {
      l.preventDefault();
      fetch(dbQuotes +  '/' + a, {
        method: 'PATCH',
        headers: {
          'content-type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          quote: document.getElementById('edit-quote').value,
          author: document.getElementById('edit-author').value,
        })
      })
      .then(resp => getQuotes(resp));
      document.getElementById('edit-quote-form').remove();
      quoteList.hidden = false;
    });
  let k = document.createElement('button');
    k.className = 'btn btn-primary';
    k.textContent = 'Cancel';
    k.id = 'cancel-btn';
    k.addEventListener('click', m => {
      m.preventDefault();
      document.getElementById('edit-quote-form').remove();
      quoteList.hidden = false;
    });
  c.appendChild(f);
  c.appendChild(g);
  d.appendChild(h);
  d.appendChild(i);
  b.appendChild(c);
  b.appendChild(d);
  b.appendChild(j);
  b.appendChild(k);
  quoteList.hidden = true;
  quoteList.parentElement.appendChild(b);
}

// Submit edits to database
function saveEdits(e) {
  e.preventDefault();
  fetch(dbQuotes +  '/' + e.target.parentElement.id, {
    method: 'PATCH',
    headers: {
      'content-type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      quote: e.target.edit-quote.value,
      author: e.target.edit-author.value,
    })
  })
  .then(resp => getQuotes(resp));
}

// Form handler
quoteForm.addEventListener('submit', e => submitForm(e));

// Submit form to database
function submitForm(e) {
  e.preventDefault();
  fetch(dbQuotes, {
    method: 'POST',
    headers:  {
      'content-type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      quote: quoteField.value,
      author: authorField.value,
    })
  })
  .then(r => r.json())
  .then(j => buildAuthor(j))
  .then(getQuotes());
  quoteForm.reset();
}

function buildAuthor(q) {
  let a = q.author;
  let b = (a.split(' '));
  let c = b[b.length - 1];
  let d = b[0];
  let e = b[1];
  let f;
  if (b.length === 1) {
    f = c;
  } else if (b.length === 2) {
    f = c + ' ' + d;
  } else {
    f = c + ' ' + d + ' ' + e;
  }
  if (q.authorName !== f) {
    fetch(dbQuotes + '/' + q.id, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        authorName: f
      })
    })
  }
}
