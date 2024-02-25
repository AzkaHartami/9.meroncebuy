import { useState } from "react";

// data manik-manik
const Meronce = [
  {
    id: 1,
    nama: "Bracelet",
    gambar: "https://img.ws.mms.shopee.co.id/id-11134207-7qul8-lj48oco6s97a33",
    harga: 8000,
  },
  {
    id: 2,
    nama: "Ring",
    gambar:
      "https://filebroker-cdn.lazada.co.id/kf/S1bc2953df7964cf0b858be104836c978G.jpg",
    harga: 3000,
  },
  {
    id: 3,
    nama: "Necklace",
    gambar:
      "https://img.lazcdn.com/g/p/04debe9b60415d8d18b8f4097c0a4bad.jpg_720x720q80.jpg",
    harga: 12000,
  },
  {
    id: 4,
    nama: "Strap-phone",
    gambar:
      "https://img.lazcdn.com/g/ff/kf/S1a2f47b28c8b4507848ec113bfa5e78fw.jpg_720x720q80.jpg",
    harga: 15000,
  },
];

//reusable button
function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

export default function App() {
  const produk = Meronce;

  const [keranjang, setKeranjang] = useState({
    Bracelet: 0,
    Ring: 0,
    Necklace: 0,
    "Strap-phone": 0,
  });

  const [totalHarga, setTotalHarga] = useState(0);

  const tambahKeKeranjang = (namaProduk, hargaProduk) => {
    setKeranjang((prevKeranjang) => ({
      ...prevKeranjang,
      [namaProduk]: prevKeranjang[namaProduk] + 1,
    }));

    setTotalHarga((prevTotalHarga) => prevTotalHarga + hargaProduk);
  };

  const kurangKekeranjang = (namaProduk, hargaProduk) => {
    setKeranjang((prevKeranjang) => {
      const updatedQuantity = Math.max(0, prevKeranjang[namaProduk] - 1);
      return {
        ...prevKeranjang,
        [namaProduk]: updatedQuantity,
      };
    });

    setTotalHarga((prevTotalHarga) => {
      const currentQuantity = keranjang[namaProduk];
      return Math.max(
        0,
        prevTotalHarga - (currentQuantity > 0 ? hargaProduk : 0)
      );
    });
  };

  return (
    <div className="content">
      <div className="produk">
        <ListProduk
          produk={produk}
          tambahKeKeranjang={tambahKeKeranjang}
          setKeranjang={setKeranjang}
          kurangKekeranjang={kurangKekeranjang}
          keranjang={keranjang}
        />
      </div>
      <div className="buy">
        <Keranjang keranjang={keranjang} totalHarga={totalHarga} />
      </div>
    </div>
  );
}

function Produk({ produk, tambahKeKeranjang, kurangKekeranjang, keranjang }) {
  const { nama, gambar, harga } = produk;

  return (
    <li key={produk.id}>
      <p>{nama}</p>
      <img src={gambar} alt={nama} className="gambar-produk" />
      <p>Rp.{harga.toLocaleString()}</p>

      <Button onClick={() => tambahKeKeranjang(nama, harga)}>+</Button>

      {keranjang[nama] > 0 && (
        <Button onClick={() => kurangKekeranjang(nama, harga)}>-</Button>
      )}
    </li>
  );
}

function ListProduk({
  produk,
  tambahKeKeranjang,
  kurangKekeranjang,
  keranjang,
}) {
  return (
    <ul>
      {produk?.map((produk) => (
        <Produk
          produk={produk}
          tambahKeKeranjang={tambahKeKeranjang}
          kurangKekeranjang={kurangKekeranjang}
          keranjang={keranjang}
        />
      ))}
    </ul>
  );
}

function Keranjang({ keranjang, totalHarga }) {
  const totalProdukDitambahkan = Object.values(keranjang).reduce(
    (total, jumlahProduk) => total + jumlahProduk,
    0
  );

  const handleBuyClick = () => {
    const productsMessage = Object.keys(keranjang)
      .filter((namaProduk) => keranjang[namaProduk] > 0)
      .map((namaProduk) => `${namaProduk}: ${keranjang[namaProduk]}`)
      .join("\n");

    const totalHargaMessage = `Total Price: Rp.${totalHarga.toLocaleString()}`;

    const message = `${productsMessage}\n${totalHargaMessage}`;
    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = "+6281275939914";

    const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    window.open(whatsappLink, "_blank");
  };

  return (
    <form className="keranjang">
      <h2>{totalProdukDitambahkan} product add</h2>

      <div className="forms">
        {Object.keys(keranjang).map((namaProduk) => (
          <div key={namaProduk} className="form-group">
            <label>{namaProduk}</label>
            <input type="text" disabled value={keranjang[namaProduk]} />
          </div>
        ))}

        <div className="total-price">
          <label>Total Price</label>
          <input
            type="text"
            disabled
            value={`Rp.${totalHarga.toLocaleString()}`}
          />
        </div>
      </div>

      <Button onClick={handleBuyClick}>Buy</Button>
    </form>
  );
}
