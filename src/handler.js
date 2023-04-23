const { nanoid } = require("nanoid");
const books = require("./books");

const addBookHandler = (request, h) => {
  // ambil data dari request body
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

  // validasi : jika client tidak melampirkan properti 'name'
  if (!name) {
    const response = h.response({
      status: "fail",
      message: "Gagal menambahkan buku. Mohon isi nama buku",
    });
    response.code(400);
    return response;
  }
  // validasi : jika client memasukkan nilai 'readPage' lebih besar dari pada nilai 'pageCount'
  if (readPage > pageCount) {
    const response = h.response({
      status: "fail",
      message:
        "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
    });
    response.code(400);
    return response;
  }

  // membuat value dari properti selain request body
  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;

  //   buat object buku baru
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

  // masukkan buku baru kedalam array
  books.push(newBook);

  // validasi : jika buku masuk kedalam array
  const isSuccess = books.filter((book) => book.id === id).length > 0;

  // kalo buku masuk
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

  // kalo buku ga masuk
  const response = h.response({
    status: "fail",
    message: "Buku gagal ditambahkan",
  });
  response.code(500);
  return response;
};

const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  //
  let filteredBooks = books.map(
    ({ id, name, publisher, reading, finished }) => ({
      id,
      name,
      publisher,
      reading,
      finished,
    })
  );

  // query parameter ?name
  if (name) {
    filteredBooks = filteredBooks.filter((book) =>
      book.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  // query parameter ?reading
  if (reading === "0") {
    filteredBooks = filteredBooks.filter((book) => !book.reading);
  } else if (reading === "1") {
    filteredBooks = filteredBooks.filter((book) => book.reading);
  }

  // query parameter ?finished
  if (finished === "0") {
    filteredBooks = filteredBooks.filter((book) => !book.finished);
  } else if (finished === "1") {
    filteredBooks = filteredBooks.filter((book) => book.finished);
  }
  return {
    status: "success",
    data: {
      books: filteredBooks,
    },
  };
};

const getBookByIdHandler = (request, h) => {
  // ambil id dari params
  const { id } = request.params;

  // cek apakah id tersebut ada di dalam array
  const book = books.filter((book) => id === book.id)[0];

  // kalo buku ada
  if (book !== undefined) {
    const response = h.response({
      status: "success",
      data: {
        book,
      },
    });
    response.code(200);
    return response;
  }

  // kalo buku ngga ada
  const response = h.response({
    status: "fail",
    message: "Buku tidak ditemukan",
  });
  response.code(404);
  return response;
};

const editBookByIdHandler = (request, h) => {
  // ambil id dari params
  const { id } = request.params;

  // ambil data dari request body
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

  // validasi : jika client tidak mengisi properti name
  if (!name) {
    const response = h.response({
      status: "fail",
      message: "Gagal memperbarui buku. Mohon isi nama buku",
    });
    response.code(400);
    return response;
  }

  // validasi : jika client mengisi properti readPage tetapi nilainya lebih dari properti pageCount
  if (readPage > pageCount) {
    const response = h.response({
      status: "fail",
      message:
        "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
    });
    response.code(400);
    return response;
  }

  // cari id di array
  const index = books.findIndex((book) => id === book.id);

  // validasi : jika id tidak ada didalam array
  if (index === -1) {
    const response = h.response({
      status: "fail",
      message: "Gagal memperbarui buku. Id tidak ditemukan",
    });
    response.code(404);
    return response;
  }

  const updatedAt = new Date().toISOString();

  // data ditimpa dengan yang baru
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

  // berikan response kalau buku sudah diedit
  const response = h.response({
    status: "success",
    message: "Buku berhasil diperbarui",
  });
  response.code(200);
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  // ambil id dari requst params
  const { id } = request.params;

  // cari index sesuai dengan id
  const index = books.findIndex((book) => id === book.id);

  // validasi : jika id yang dicari tidak ada
  if (index === -1) {
    const response = h.response({
      status: "fail",
      message: "Buku gagal dihapus. Id tidak ditemukan",
    });
    response.code(404);
    return response;
  }

  // jika id yang dicari ada
  // hapus data dengan method splice()
  books.splice(index, 1);

  // berikan respon
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
