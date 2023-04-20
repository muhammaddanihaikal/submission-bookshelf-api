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
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;
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
    createdAt,
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

const getAllBooksHandler = (request, h) => ({
  // langsung kirim object
  status: "success",
  data: {
    books,
  },
});

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

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
};
