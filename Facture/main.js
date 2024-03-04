

const apiUrl = 'https://elhoussam.github.io/invoicesapi/db.json'; // Replace 'YOUR_API_URL_HERE' with the actual URL of your API

function fetchDataAndPopulateTable() {
  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      const tableBody = document.querySelector('#dataTable tbody');
      tableBody.innerHTML = '';
       var Tel = true;
      data.forEach(invoice => {
        let totalAmount = 0;
        invoice.InvoiceItems.forEach(item => {
          totalAmount += item.ItemQuantity * item.ItemPrice;
        });
        var dateFormatee = GetDate(invoice.InvoiceDate);
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${invoice.InvoiceID}</td>
          <td>${dateFormatee}</td>
          <td>${invoice.ClientName}</td>                        
          <td>${invoice.SupplierName}</td>              
          <td>${totalAmount}</td>
          <td><button class="button button2" onclick="printInvoice('${invoice.InvoiceID}')">Afficher</button></td>
         
        `;
        tableBody.appendChild(row);
      });
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });
}
var GetDate = function (dateString) {  
  var date = new Date(dateString);
  var mois = [
    "Jan", "Fév", "Mar", "Avr", "Mai", "Juin",
    "Juil", "Août", "Sept", "Oct", "Nov", "Déc"
  ];
  var jour = date.getDate();
  var moisIndex = date.getMonth();
  var annee = date.getFullYear();

  var dateFormatee = jour + " " + mois[moisIndex] + " " + annee;

  return dateFormatee;
}
var centeredText = function(doc , text, y) {
  var textWidth = doc.getStringUnitWidth(text) * doc.internal.getFontSize() / doc.internal.scaleFactor;
  var textOffset = (doc.internal.pageSize.width - textWidth) / 2;
  doc.text(textOffset, y, text);
}
function printInvoice(invoiceID ) {

  //console.log("Printing invoice with ID:", invoiceID);
  const apiUrl = 'https://elhoussam.github.io/invoicesapi/db.json';
  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      let printed = false; 
      data.forEach(invoice => {
        if (invoice.InvoiceID == invoiceID && !printed) {
      //    console.log("Printing invoice with ID:", invoice.ClientName);
          printed = true; 
          var doc = new jsPDF("p", "pt", "a4");
          doc.setFont("bold");
          doc.setFontType("bolditalic");
          doc.setFontSize(18);        
          centeredText(doc,`Facture N°: ${invoiceID}`, 80)  
          doc.setFont('Lato-Regular', 'normal');
       
          doc.setFont('Lato-Regular', 'normal');
          doc.setFontSize(13);         
          var dateFormatee = GetDate(invoice.InvoiceDate);
          doc.text(300, 110, ['Date de facture : ' + dateFormatee]);
          doc.setFontSize(11);
          doc.text(70,200, ['FOURNISSEUR']);
          doc.text(320,215, ['CLIENT ']);
          doc.setTextColor(88, 162, 59); /// rgb(88, 162, 59)
          doc.text(70,205, ['_____________________________']);
          doc.text(320,220, ['_____________________________']);
          doc.setTextColor(0, 0, 0);

          doc.setFontSize(10);
          doc.setFontType("bolditalic");
          doc.text(70,220, ["[Nom de l'entreprise "]);
          doc.text(70,235, ["du FOUNISSEUR] "]);
          doc.setFont('Lato-Regular', 'normal');
          doc.setFontSize(10);
          doc.text(70, 250, ['Nom du founisseur : ' + invoice.SupplierName]);
          doc.text(70, 265, ['Téléphone du founisseur : ' + invoice.SupplierPhone]);
          doc.text(70, 280, ['Adresse du founisseur : ' + invoice.SupplierAddress]);


          doc.setFontSize(10);
          doc.setFontType("bolditalic");
          doc.text(320,235, ["[Nom de l'entreprise du client]"]);
     
          doc.setFont('Lato-Regular', 'normal');
          doc.setFontSize(10);
          doc.text(320, 250, ['Nom du client : ' + invoice.ClientName]);
          doc.text(320, 265, ['Téléphone du client : ' + invoice.ClientPhone]);
          doc.text(320, 280, ['Adresse du client : ' + invoice.ClientAddress]);
          doc.setFontSize(11);
          doc.text(320,600, ['LA SIGNATURE']);
          var headers = [['N°', 'LIBELLE', 'QUANTITÉ','PRIX','HT','TTC']];
          var Data = [];
          let total = 0;
          let tva = 0;
          let i = 1;
            invoice.InvoiceItems.forEach(item => {
            
              total += item.ItemQuantity * item.ItemPrice;
              tva += item.ItemQuantity * item.ItemTax;
               //console.log(item.ItemLibelle)               
               Data.push([i++, item.ItemLibelle, item.ItemQuantity, item.ItemPrice, item.ItemQuantity*item.ItemPrice , (item.ItemPrice+item.ItemTax)*item.ItemQuantity]);
               
            
            });

          
         
          doc.autoTable({
              head: headers,
              body: Data,
              headStyles: { fillColor: [251,187,139],
                            textColor: [0, 0, 0] } ,
                            margin: { top: 310 },                                          
          });


          var data_Total = [
            ['TOTAL', total],
            [ 'TVA', tva],
            [ 'Total TTC ', total+tva],               
        ];
        doc.autoTable({
         //   head: headers,
            body: data_Total,
            headStyles: { fillColor: [251,187,139],
                          textColor: [0, 0, 0] } ,
                          margin: { left: 300  },
                        //  margin: { top: 350 },                                           
        });
        
       
      window.open(doc.output('bloburl'));
    
  
        }
      });
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });

}



window.onload = fetchDataAndPopulateTable;