document.addEventListener('DOMContentLoaded', () => {
  fetchBooks();
  setupSortDialog();
});

function setupSortDialog() {
  document.getElementById('sort-filter').addEventListener('change', function() {
    const sortDialog = document.getElementById('sort-dialog');
    sortDialog.classList.remove('hidden');
    sortDialog.classList.add('flex');
  });

  document.getElementById('sort-asc').addEventListener('click', function() {
    sortBooks('asc');
  });

  document.getElementById('sort-desc').addEventListener('click', function() {
    sortBooks('desc');
  });
}

function sortBooks(order) {
  const sortField = document.getElementById('sort-filter').value;
  // Implement sorting logic here
  // Hide the dialog after sorting
  const sortDialog = document.getElementById('sort-dialog');
  sortDialog.classList.add('hidden');
  sortDialog.classList.remove('flex');
  // Fetch books with sorting
  fetchBooks(1, sortField, order); // Reset to first page with sorting
}

async function fetchBooks(page = 1, sortField = '', sortOrder = '') {
  const genre = document.getElementById('genre-filter').value;
  const author = document.getElementById('author-filter').value;
  const purchaseCount = document.getElementById('sold-filter').value;
  const priceMin = document.getElementById('price-min').value;
  const priceMax = document.getElementById('price-max').value;
  const searchText = document.getElementById('search-text').value;

  if ((priceMin && !priceMax) || (!priceMin && priceMax)) {
    alert('Please enter both minimum and maximum price.');
    return;
  }

  const loadingIndicator = document.getElementById('loading-indicator');
  if (loadingIndicator) loadingIndicator.style.display = 'block';

  try {
    const response = await fetch('/books/search-and-filter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        genre,
        author,
        purchaseCount,
        price: `${priceMin}-${priceMax}`,
        searchText,
        page,
        limit: ITEMS_PER_PAGE,
        sortField,
        sortOrder
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const { books, totalPages } = await response.json();
    updateBookList(books);
    renderPagination(totalPages, sortField, sortOrder);

  } catch (error) {
    console.error('Error:', error);
    alert('Error searching and filtering books. Please try again.');
  } finally {
    if (loadingIndicator) loadingIndicator.style.display = 'none';
  }
}

document.getElementById('search-button').addEventListener('click', (event) => {
  event.preventDefault();
  currentPage = 1; // Reset to first page on new search
  fetchBooks();
});

document.getElementById('search-btn').addEventListener('click', (event) => {
  event.preventDefault();
  currentPage = 1; // Reset to first page on new search
  fetchBooks();
});

const ITEMS_PER_PAGE = 4;
let currentPage = 1;

function updateBookList(books) {
  const bookList = document.getElementById('book-list');
  bookList.innerHTML = '';
  books.forEach(book => {
    const bookItem = `
      <li class="mb-8 md:col-6">
        <a href="/list/${book.title_id}">
          <div class="card">
            <img class="card-img" width="235" height="304" src="${book.image}" alt="${book.title}" />
            <div class="card-content">
              <div class="card-tags">
                <a class="tag" href="#">${book.genre}</a>
              </div>
              <h3 class="h4 card-title">
                <a href="/list/${book.title_id}">${book.title}</a>
              </h3>
              <p>
                Author: ${book.author}
                <br>
                <b class="text-red-500">Prices: ${book.price} VND</b>
              </p>
              <div class="card-footer mt-6 flex space-x-4">
                <span class="inline-flex items-center text-xs text-[#666]">
                  <svg class="mr-1.5" width="14" height="16" viewBox="0 0 14 16" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M12.5 2H11V0.375C11 0.16875 10.8313 0 10.625 0H9.375C9.16875 0 9 0.16875 9 0.375V2H5V0.375C5 0.16875 4.83125 0 4.625 0H3.375C3.16875 0 3 0.16875 3 0.375V2H1.5C0.671875 2 0 2.67188 0 3.5V14.5C0 15.3281 0.671875 16 1.5 16H12.5C13.3281 16 14 15.3281 14 14.5V3.5C14 2.67188 13.3281 2 12.5 2ZM12.3125 14.5H1.6875C1.58438 14.5 1.5 14.4156 1.5 14.3125V5H12.5V14.3125C12.5 14.4156 12.4156 14.5 12.3125 14.5Z"
                      fill="#939393" />
                  </svg>
                  ${book.pages} trang
                </span>
                <span class="inline-flex items-center text-xs text-[#666]">
                  <svg class="mr-1.5" width="16" height="16" viewBox="0 0 16 16" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M7.65217 0C3.42496 0 0 3.58065 0 8C0 12.4194 3.42496 16 7.65217 16C11.8794 16 15.3043 12.4194 15.3043 8C15.3043 3.58065 11.8794 0 7.65217 0ZM7.65217 14.4516C4.24264 14.4516 1.48107 11.5645 1.48107 8C1.48107 4.43548 4.24264 1.54839 7.65217 1.54839C11.0617 1.54839 13.8233 4.43548 13.8233 8C13.8233 11.5645 11.0617 14.4516 7.65217 14.4516ZM9.55905 11.0839L6.93941 9.09355C6.84376 9.01935 6.78822 8.90323 6.78822 8.78065V3.48387C6.78822 3.27097 6.95484 3.09677 7.15849 3.09677H8.14586C8.34951 3.09677 8.51613 3.27097 8.51613 3.48387V8.05484L10.5773 9.62258C10.7439 9.74839 10.7778 9.99032 10.6575 10.1645L10.0774 11C9.95708 11.171 9.72567 11.2097 9.55905 11.0839Z"
                      fill="#939393" />
                  </svg>
                  ${book.sold} sách đã bán
                </span>
              </div>
            </div>
          </div>
        </a>
      </li>
    `;
    bookList.insertAdjacentHTML('beforeend', bookItem);
  });
}

function renderPagination(totalPages, sortField, sortOrder) {
  const pagination = document.getElementById('pagination');
  pagination.innerHTML = '';

  const prevButton = document.createElement('button');
  prevButton.textContent = '<';
  prevButton.classList.add('mx-1', 'px-3', 'py-1', 'border', 'rounded');
  if (currentPage === 1) {
    prevButton.disabled = true;
  }
  prevButton.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      fetchBooks(currentPage, sortField, sortOrder);
    }
  });
  pagination.appendChild(prevButton);

  const pageInfo = document.createElement('span');
  pageInfo.textContent = `${currentPage} / ${totalPages}`;
  pageInfo.classList.add('mx-2', 'px-3', 'py-1');
  pagination.appendChild(pageInfo);

  const nextButton = document.createElement('button');
  nextButton.textContent = '>';
  nextButton.classList.add('mx-1', 'px-3', 'py-1', 'border', 'rounded');
  if (currentPage === totalPages) {
    nextButton.disabled = true;
  }
  nextButton.addEventListener('click', () => {
    if (currentPage < totalPages) {
      currentPage++;
      fetchBooks(currentPage, sortField, sortOrder);
    }
  });
  pagination.appendChild(nextButton);
}
