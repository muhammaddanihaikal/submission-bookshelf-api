const { nanoid } = require("nanoid");
const books = require("./books");

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  // validasi : client tidak mengisi properti 'name' pada request body
  if (!name) {
    const response = h.response({
      status: "fail",
      message: "Gagal menambahkan buku. Mohon isi nama buku",
    });
    response.code(400);
    return response;
  }

  // validasi : client mengisikan value 'readPage' lebih besar dari value 'pageCount' pada request body
  if (readPage > pageCount) {
    const response = h.response({
      status: "fail",
      message:
        "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
    });
    response.code(400);
    return response;
  }

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);

  // validasi : buku berhasil masuk kedalam array
  const isSuccess = books.filter((book) => book.id === id).length > 0;

  // resonse success
  if (isSuccess) {
    const response = h.response({
      status: "success",
      message: "Buku berhasil ditambahkan",
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  // response gagal
  const response = h.response({
    status: "fail",
    message: "Buku gagal ditambahkan",
  });
  response.code(500);
  return response;
};

const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  let filteredBooks = books;

  // validasi : user memasukkan query parameter '?name' pada request url
  if (name) {
    filteredBooks = filteredBooks.filter((book) =>
      book.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  // validasi : user memasukkan query parameter '?reading' pada request url
  if (reading === "0") {
    filteredBooks = filteredBooks.filter((book) => !book.reading);
  } else if (reading === "1") {
    filteredBooks = filteredBooks.filter((book) => book.reading);
  }

  // validasi : user memasukkan query parameter '?finished' pada request url
  if (finished === "0") {
    filteredBooks = filteredBooks.filter((book) => !book.finished);
  } else if (finished === "1") {
    filteredBooks = filteredBooks.filter((book) => book.finished);
  }

  // mengembalikan 3 properti saja : id, name, publisher
  filteredBooks = filteredBooks.map(({ id, name, publisher }) => ({
    id,
    name,
    publisher,
  }));

  // response success
  return {
    status: "success",
    data: {
      books: filteredBooks,
    },
  };
};

const getBookByIdHandler = (request, h) => {
  const { id } = request.params;

  // pengecekan buku berdasarkan id
  const book = books.filter((book) => id === book.id)[0];

  // validasi : buku ada pada array
  if (book !== undefined) {
    // response success
    const response = h.response({
      status: "success",
      data: {
        book,
      },
    });
    response.code(200);
    return response;
  }

  // response gagal
  const response = h.response({
    status: "fail",
    message: "Buku tidak ditemukan",
  });
  response.code(404);
  return response;
};

const editBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  // validasi : client tidak memasukkan properti 'name' pada request body
  if (!name) {
    const response = h.response({
      status: "fail",
      message: "Gagal memperbarui buku. Mohon isi nama buku",
    });
    response.code(400);
    return response;
  }

  // validasi : client mengisikan value 'readPage' lebih besar dari value 'pageCount' pada request body
  if (readPage > pageCount) {
    const response = h.response({
      status: "fail",
      message:
        "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
    });
    response.code(400);
    return response;
  }

  // cari index berdasarkan id
  const index = books.findIndex((book) => id === book.id);

  // validasi : buku tidak ditemukan dalam array
  if (index === -1) {
    const response = h.response({
      status: "fail",
      message: "Gagal memperbarui buku. Id tidak ditemukan",
    });
    response.code(404);
    return response;
  }

  const updatedAt = new Date().toISOString();

  // updata data buku
  books[index] = {
    ...books[index],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    updatedAt,
  };

  // response success
  const response = h.response({
    status: "success",
    message: "Buku berhasil diperbarui",
  });
  response.code(200);
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params;

  // cari index berdasarkan id
  const index = books.findIndex((book) => id === book.id);

  // validasi : buku tidak ditemukan di array
  if (index === -1) {
    const response = h.response({
      status: "fail",
      message: "Buku gagal dihapus. Id tidak ditemukan",
    });
    response.code(404);
    return response;
  }

  // hapus buku berdasarkan index
  books.splice(index, 1);

  // response succes
  const response = h.response({
    status: "success",
    message: "Buku berhasil dihapus",
  });
  response.code(200);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
