(function (win, doc) {
  "use strict";

  window.Mercadopago.setPublishableKey(
    "TEST-32d35168-ec99-468f-8f34-7faebc2fa724"
  );

  window.Mercadopago.getIdentificationTypes();

  document
    .getElementById("cardNumber")
    .addEventListener("change", guessPaymentMethod);

  function guessPaymentMethod(event) {
    let cardnumber = document.getElementById("cardNumber").value;
    if (cardnumber.length >= 6) {
      let bin = cardnumber.substring(0, 6);
      window.Mercadopago.getPaymentMethod(
        {
          bin: bin,
        },
        setPaymentMethod
      );
    }
  }

  function setPaymentMethod(status, response) {
    if (status == 200) {
      let paymentMethod = response[0];
      document.getElementById("paymentMethodId").value = paymentMethod.id;
      getIssuers(paymentMethod.id);
      doc.querySelector(".brand").innerHTML="<img src='"+response[0].thumbnail+"' alt='Bandeira do Cartão'>";
    } else {
      alert(`payment method info error: ${response}`);
    }
  }

  function getIssuers(paymentMethodId) {
    window.Mercadopago.getIssuers(
        paymentMethodId,
        setIssuers
    );
 }
 
 function setIssuers(status, response) {
    if (status == 200) {
        let issuerSelect = document.getElementById('issuer');
        response.forEach( issuer => {
            let opt = document.createElement('option');
            opt.text = issuer.name;
            opt.value = issuer.id;
            issuerSelect.appendChild(opt);
        });
 
        getInstallments(
            document.getElementById('paymentMethodId').value,
            document.getElementById('transactionAmount').value,
            issuerSelect.value
        );
    } else {
        alert(`issuers method info error: ${response}`);
    }
 }

 function getInstallments(paymentMethodId, transactionAmount, issuerId){
    window.Mercadopago.getInstallments({
        "payment_method_id": paymentMethodId,
        "amount": parseFloat(transactionAmount),
        "issuer_id": parseInt(issuerId)
    }, setInstallments);
 }
 
 function setInstallments(status, response){
    if (status == 200) {
        document.getElementById('installments').options.length = 0;
        response[0].payer_costs.forEach( payerCost => {
            let opt = document.createElement('option');
            opt.text = payerCost.recommended_message;
            opt.value = payerCost.installments;
            document.getElementById('installments').appendChild(opt);
        });
        console.log(response);
    } else {
        alert(`installments method info error: ${response}`);
    }
 }
})(window, document);
