import { useState } from "react";
import { Row, Col, Container, Form, Button, CloseButton, Table, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";

const AdminCreateProductPage = () => {
  const [validated, setValidated] = useState(false);

  const handleSubmit = (event) => {
    const form = event.currentTarget;

    event.preventDefault();
    event.stopPropagation();

    if (form.checkValidity()) {
      // Product creation API call will be added here.
    }

    setValidated(true);
  };

  return (
    <Container>
      <Row className="justify-content-md-center mt-5">
        <Col md={1}>
          <Link to="/admin/products" className="btn btn-info my-3">
            Go back
          </Link>
        </Col>
        <Col md={6}>
          <h1>Create a new product</h1>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Label>Name</Form.Label>
              <Form.Control name="name" required type="text" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control name="description" required as="textarea" rows={3} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicCount">
              <Form.Label>Count in Stock</Form.Label>
              <Form.Control name="count" required type="number" min="0" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPrice">
              <Form.Label>Price</Form.Label>
              <Form.Control name="price" required type="number" min="0" step="0.01" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicCategory">
              <Form.Label>Category
              <CloseButton />(<small>remove selected</small>)
              </Form.Label>
              <Form.Select required name="category" defaultValue="">
                <option value="" disabled>
                  Choose category
                </option>
                <option value="Laptops">Laptops</option>
                <option value="TV">TV</option>
                <option value="Games">Games</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicNewCategory">
              <Form.Label>
                Or create a new category (e.g. Computers/Laptop/Intel){" "}

              </Form.Label>
              <Form.Control name="newCategory" type="text" />
            </Form.Group>
            <Row className="mt-5">
               <Col md={6}>
               <Form.Group className="mb-3" controlId="formBasicAttribute">
                <Form.Label>Choose attribute and set value</Form.Label>
                <Form.Select
                  name="atrrKey"
                  aria-label="Default select example">
                    <option>Choose attribute</option>
                    <option value="red">color</option>
                  </Form.Select>
               </Form.Group>
               </Col>
               <Col md={6}>
                <Form.Group className="mb-3" controlId="formBasicAttribute">
                <Form.Label>Attribute value</Form.Label>
                <Form.Select
                  name="atrrKey"
                  aria-label="Default select example">
                    <option>Choose attribute value</option>
                    
                  </Form.Select>
               </Form.Group>
               </Col>
            </Row>
            <Row>
                <Table hover>
                  <thead>
                     <tr>
                         <th>Attribute</th>
                         <th>Value</th>
                         <th>Delete</th>
                     </tr>
                  </thead>
                  <tbody>
                    <tr>
                       <td>attr key</td>
                       <td>attr value</td>
                       <td>
                          <CloseButton />
                       </td>
                    </tr>
                  </tbody>
                </Table>

            </Row>
            <Row>
                <Col md={6}>
                <Form.Group className="mb-3"
                   controlId="formBasicNewAttribute">
                    <Form.Label>Create new attribute</Form.Label>
                    <Form.Control 
                       disabled={false}
                       placeholder="First choose or create a category"
                       name="newAttribute"
                       type="text"
                       />
                   </Form.Group>
                </Col> 
                <Col md={6}>
                <Form.Group className="mb-3"
                   controlId="formBasicNewAttributeValue">
                    <Form.Label>Attribute value</Form.Label>
                    <Form.Control 
                       disabled={false}
                       placeholder="First choose or create a category"
                       required={true}
                       name="newAttributeValue"
                       type="text"
                       />
                   </Form.Group>
                </Col>
                
            </Row>
            <Alert variant="primary">
              After typing attribute key and value press enter on one of the field
            </Alert>

            <Form.Group controlId="formFileMultiple" className="mb-3 mt-3">
              <Form.Label>Images</Form.Label>
              <Form.Control required type="file" multiple />
            </Form.Group>

            <Button type="submit" variant="primary">
              Create product
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminCreateProductPage;
