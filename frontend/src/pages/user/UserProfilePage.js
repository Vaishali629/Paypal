import { Container, Row, Col, Alert, Form, Button,  } from "react-bootstrap";
import { useState } from "react";


const UserProfilePage = () => {
  const [validated, setValidated] = useState(false);

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);
  };

  return (
      <Container>
        <Row className="mt-5 justify-content-md-center">
          
          <Col md={6}>
           <h1>User Profile</h1>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
      
        <Form.Group className="mb-3" controlId="validationCustom01">
          <Form.Label>Enter your name</Form.Label>
          <Form.Control
            required
            type="text"
            defaultValue="John"
            name="name"
          />
          <Form.Control.Feedback type="invalid">Please enter a name</Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicLastName">
          <Form.Label>Your Last name</Form.Label>
          <Form.Control
            required
            type="text" 
            defaultValue="Doe"
            name="lastName"
          />
          <Form.Control.Feedback type="invalid">Please enter your last name</Form.Control.Feedback>
        </Form.Group>
         <Form.Group className="mb-3" controlId="forBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
          disabled
            name="email"
            value="john@doe.com  if you want to change email, remove account and create new one
             with new email address"
            
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPhone">
          <Form.Label>Phone numder</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your phone number"
            defaultValue=""
          />
      
        </Form.Group>
         <Form.Group className="mb-3" controlId="formBasicAddress">
          <Form.Label>Address</Form.Label>
          <Form.Control
            type="text" 
            placeholder="Enter your street name and house number"
            defaultValue=""
          />
          
        </Form.Group>
         <Form.Group className="mb-3" controlId="formBasicCountry">
          <Form.Label>Country</Form.Label>
          <Form.Control
            type="text" 
            placeholder="Enter your country"
            defaultValue=""
          />
          
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicZip">
          <Form.Label>Zip Code</Form.Label>
          <Form.Control
            type="text" 
            placeholder="Enter your Zip code"
            defaultValue=""
          />
          
        </Form.Group>
         <Form.Group className="mb-3" controlId="formBasicCity">
          <Form.Label>City</Form.Label>
          <Form.Control
            type="text" 
            placeholder="Enter your city"
            defaultValue=""
          />
          
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicState">
          <Form.Label>State</Form.Label>
          <Form.Control
            type="text" 
            placeholder="Enter your state"
            defaultValue=""
          />
          
        </Form.Group>
    
    
    
       
       
      <Button variant="primary" type="submit">
        Update </Button>
        <Alert show={true} variant="danger">
          User with that email already exists!
        </Alert>
         <Alert show={true} variant="info">
          User updated
        </Alert>
    </Form>
  
          </Col>
        </Row>
        

        
      </Container>
  );
};

export default UserProfilePage;