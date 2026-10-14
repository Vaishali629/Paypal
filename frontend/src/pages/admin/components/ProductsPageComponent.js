import { Row, Col, Table, Button, Alert } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import AdminLinksComponent from "../../../components/admin/AdminLinksComponent";
import { useState, useEffect }  from "react";
const ProductsPageComponent = ({fetchProducts, deleteProduct}) => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState("");

    const deleteHandler = async (productId) => {
      if (!window.confirm("Are you sure you want to delete this product?")) return;

      try {
        await deleteProduct(productId);
        setProducts(currentProducts =>
          currentProducts.filter(product => product._id !== productId)
        );
        setError("");
      } catch (requestError) {
        const responseMessage =
          requestError.response?.data?.message || requestError.response?.data;
        const message =
          typeof responseMessage === "string"
            ? responseMessage
            : requestError.message || "Unable to delete product.";
        setError(message);
        console.error("Failed to delete product:", requestError);
      }
    };

    useEffect(() => {
         const abctrl = new AbortController();
         fetchProducts(abctrl.signal)
           .then((res) => setProducts(res))
           .catch(requestError => {
             if (abctrl.signal.aborted) return;

             const responseMessage =
               requestError.response?.data?.message ||
               requestError.response?.data;
             const message =
               typeof responseMessage === "string"
                 ? responseMessage
                 : requestError.message || "Unable to load products.";
             setError(message);
             console.error("Failed to fetch products:", requestError);
           });
         return () => abctrl.abort();
    }, [fetchProducts]);
  return (
    <Row className="m-5">
        <Col md={2}>
        <AdminLinksComponent />
        </Col>
      <Col md={10}>
          <h1>Product List{" "}
            <LinkContainer to="/admin/create-product">
             <Button variant="primary" size="lg" >
              Create new
            </Button>
            </LinkContainer>
            
          </h1>
          {error && <Alert variant="danger">{error}</Alert>}
          
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>#</th>
          <th>Product Name</th>
          <th>Price</th>
          <th>Category</th>
          <th>Edit/Delete</th>
        </tr>
      </thead>
      <tbody>
        {products.map((item, idx) => (
            <tr key={item._id}>
              <td>{idx + 1}</td>
              <td>{item.name}</td>
              <td>{item.price}</td>
              <td>{item.category}</td>
              <td>
                <LinkContainer to={`/admin/edit-product/${item._id}`}>
                 <Button className="btn-sm">
                <i className="bi bi-pencil-square"></i>
                </Button>
                </LinkContainer>
                { " / "}
                 <Button variant="danger" className="btn-sm" onClick={() => deleteHandler(item._id)}>
                <i className="bi bi-x-circle"></i>
                </Button>
                
              </td>
              
              
            </tr>
          )
        )}
      </tbody>
    </Table>
  
    </Col>
    </Row>
  );
};

export default ProductsPageComponent;
