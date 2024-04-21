import 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import IFrame from '@uiw/react-iframe';
import SignalRService from './SignalRService';

function App() {

  const [html, setHTML] = useState();
  const [orderNumber, setOrderNumber] = useState();

   const Payment = () =>
   {
    axios
      .get('https://localhost:7042/api/Payment')
      .then((response) => {
        const backendHtmlString = response.data.message
        console.log(backendHtmlString)
        setHTML(backendHtmlString)
        setOrderNumber(response.data.orderNumber)
      })
      .catch((err) => {
        console.log(err);
      });
    
   }

  const { connect, onReceive, offReceive, registerTransactionId } = SignalRService();
  const [message, setMessage] = useState("At the payment stage");
  const success = "Payment successful";
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);

  useEffect(() => {
    const handlePaymentResult = (data) => {
      if (data.statu === 1 && !isPaymentSuccess) {
        setIsPaymentSuccess(true);
        setMessage(success);
        console.log(message);
      }
      console.log("Received message:", data);
    };

    connect();

    onReceive(handlePaymentResult);

    registerTransactionId(orderNumber);

    return () => {
      offReceive(handlePaymentResult);
    };
  }, [connect, onReceive, offReceive, success, registerTransactionId]);

  return (
    <div className='App'>
      <div className="container text-center">
        <div className="row mt-5">
          <div className="col-2">
          </div>
          <div className="col-8">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Iyzico Pay</h5>
                <button onClick={Payment} className="btn btn-primary">Let's Payment</button>
              </div>
            </div>
          </div>
          <div className="col-2">
          </div>
        </div>
        <div className="row mt-5">
          <div className="col-2">
          </div>
          {isPaymentSuccess 
          ? (
              <div className="col-8">
                <h2 style={{color:"green"}}>{message}</h2>    
              </div>
            )
          :
            (
              <div className="col-8">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Iyzico Pay 3Ds Iframe</h5>
                    <IFrame initialContent={html} width={500} height={500}></IFrame>
                  </div>
                </div>
              </div>
            )  
          }
          
          <div className="col-2">
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
