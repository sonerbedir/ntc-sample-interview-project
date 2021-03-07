var NUMBER2TEXT = {
  ones: [
    "",
    "bir",
    "iki",
    "üç",
    "dört",
    "beş",
    "altı",
    "yedi",
    "sekiz",
    "dokuz",
    "on",
    "onbir",
    "oniki",
    "onüç",
    "ondört",
    "onbeş",
    "onaltı",
    "onyedi",
    "onsekiz",
    "ondokuz",
  ],
  tens: [
    "",
    "",
    "yirmi",
    "otuz",
    "kırk",
    "elli",
    "altmış",
    "yetmiş",
    "seksen",
    "doksan",
  ],
  sep: ["", " bin ", " milyon ", " milyar ", " triliyon ", " katrilyon "],
};

const numberToWords = (value) => {
  const arr = [];
  let str = "";
  let i = 0;
  value = parseInt(value.replace(".", ""), 10);
  console.log(value);
  while (value) {
    arr.push(value % 1000);
    value = parseInt(value / 1000, 10);
  }

  while (arr.length) {
    str =
      (function (a) {
        var x = Math.floor(a / 100),
          y = Math.floor(a / 10) % 10,
          z = a % 10;

        return (
          (x > 0 ? NUMBER2TEXT.ones[x] + " yüz " : "") +
          (y >= 2
            ? NUMBER2TEXT.tens[y] + " " + NUMBER2TEXT.ones[z]
            : NUMBER2TEXT.ones[10 * y + z])
        );
      })(arr.shift()) +
      NUMBER2TEXT.sep[i++] +
      str;
  }
  return str;
  console.log(str);
};

$(document).ready(function () {
  $.ajax({
    url: "./assets/mocks/ntc-sample-data.json",
  }).done(function (data) {
    let totalPrice = 0;
    const calculatedData = data["Sipariş Detay Tablosu"].map((row) => {
      totalPrice += row.productPrice.toFixed(2) * row.qnty;
      return {
        ...row,
        productPrice: row.productPrice.toLocaleString("tr-TR", {
          style: "currency",
          currency: "TRY",
        }),
        total: (row.productPrice * row.qnty).toLocaleString("tr-TR", {
          style: "currency",
          currency: "TRY",
        }),
      };
    });
    const newDataSource = {
      "Sipariş Detay Tablosu": calculatedData,
    };
    const tableWrapper = $("#table-wrapper");
    const priceEl = $("#price");
    const priceTextEl = $("#price-text");
    const headers = ["ID", "Name", "Price", "Quantity", "Total"];
    const table = new NTCTable(newDataSource, headers);
    table.view = NTCTABLE_VIEW.ALL;
    tableWrapper.append(table.generateTableHtmlCode(true));
    const fixedTotalPrice = totalPrice.toFixed(2);
    console.log(fixedTotalPrice);
    numberToWords(fixedTotalPrice.split(".")[0]);
    numberToWords(fixedTotalPrice.split(".")[1]);

    priceEl.append(`
    <span class="price">
        ${Number(fixedTotalPrice.split(".")[0]).toLocaleString()},
    </span>
    <span class="fraction">
        ${fixedTotalPrice.split(".")[1]} TL
    </span>
    `);
    priceTextEl.append(`
        <span>
            <b>Yalnız</b>
            <span>${numberToWords(
              fixedTotalPrice.split(".")[0]
            )} lira ${numberToWords(fixedTotalPrice.split(".")[1])} kuruş.</span>
        </span>
    `);
  });

  $('.sidebar').eq(0).append(`
  <div>
    <h1 class="mb-2r">Sipariş Detay</h1>
  <div class="mt-5">
    <h4>Firma Adı</h4>
    <p>Halil Pazarlama</p>
  </div>
  <div class="mt-5">
    <h4>Adres</h4>
    <p>Koz yatağı mahallesi, Marmara Cad. Şale Apt. No: 7  Kadıköy/İstanbul</p>
  </div>
  <div class="mt-5">
    <h4>e-Posta</h4>
    <p>kapinizda@halilpazarlama.com</p>
</div>
<div class="mt-5">
   <h4>Ünvan</h4>
   <p>Halil Pazarlama İnş. Tah. Turz. Tic. Ltd. Şti.</p>
</div>
<div class="mt-5">
   <h4>Fatura Adresi</h4>
   <p>Koz yatağı mahallesi, Marmara Cad. Şale Apt. No: 7  Kadıköy/İstanbul</p>
</div>
<div class="mt-5">
   <h4>Vergi dairesi</h4>
   <p>Büyük mükellefler vd.</p>
</div>
<div class="mt-5">
   <h4>Vergi no</h4>
   <p>123456789012</p>
</div>
  `);

});


