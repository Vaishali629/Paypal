import { Container, Row, Col, Alert, Form, Button,  } from "react-bootstrap";
import { useState } from "react";
import { Link } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";

const RegisterPage = () => {
  const [validated, setValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onChange = () => {
    const password = document.querySelector("input[name=password]")
      const confirm = document.querySelector("input[name=confirmPassword]")
      if(confirm.value === password.value) {
          confirm.setCustomValidity("")
      } else {
        confirm.setCustomValidity("Password do not match")
      }
  }

  const handleSubmit = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();

    if (form.checkValidity() === false) {
      setValidated(true);
      return;
    }

    setValidated(true);
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData(form);
      const response = await fetch("/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          lastName: formData.get("lastName"),
          email: formData.get("email"),
          password: formData.get("password"),
        }),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Unable to create user.");

      setSuccess(data.message);
      form.reset();
      setValidated(false);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <Container>
        <Row className="mt-5 justify-content-md-center">
          
          <Col md={6}>
           <h1>Register</h1>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
      
        <Form.Group className="mb-3" controlId="validationCustom01">
          <Form.Label>Enter your name</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Enter your name"
            name="name"
          />
          <Form.Control.Feedback type="invalid">Please enter a name</Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md="4" controlId="formBasicLastName">
          <Form.Label>Your Last name</Form.Label>
          <Form.Control
            required
            type="text" 
            placeholder="Enter your Last name"
            name="lastName"
          />
          <Form.Control.Feedback type="invalid">Please enter your last name</Form.Control.Feedback>
        </Form.Group>
         <Form.Group className="mb-3" controlId="forBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
          name="email"
            required
            type="email"
            placeholder="Enter email"
            
          />
          <Form.Control.Feedback type="invalid">Please enter a valid email address</Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            name="password"
            required
            type="password" 
            placeholder="Password"
            minLength={6}
            onChange={onChange}
          />
          <Form.Control.Feedback type="invalid">Please enter a valid password</Form.Control.Feedback>
          <Form.Text className="text-muted">
             Password should have at least 6 characters
          </Form.Text>
        </Form.Group>
         <Form.Group className="mb-3" controlId="formBasicPasswordRepeat">
          <Form.Label>Repeat Password</Form.Label>
          <Form.Control
            name="confirmPassword"
            required
            type="password" 
            placeholder="Repeat Password"
            minLength={6}
            onChange={onChange}
          />
          <Form.Control.Feedback type="invalid">Both passwords should match</Form.Control.Feedback>
        </Form.Group>
        <Row className="pb-2">
            <Col>
            Do you have an account already?
            <Link to={"/login"}> Login </Link>
            </Col>
        </Row>
       
       
      <Button type="submit">
        {isLoading && <Spinner
         as="span"
         animation="border"
         size="sm"
         role="status"
         aria-hidden="true" className="me-2"/>}
        {isLoading ? "Creating..." : "Submit"} </Button>
        <Alert show={Boolean(error)} variant="danger">{error}</Alert>
         <Alert show={Boolean(success)} variant="info">{success}</Alert>
    </Form>
  
          </Col>
        </Row>
        

        
      </Container>
  );
};

export default RegisterPage;
