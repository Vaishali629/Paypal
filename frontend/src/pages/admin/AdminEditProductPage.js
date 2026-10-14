import { useEffect, useState } from "react";
import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const AdminEditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: "",
    description: "",
    count: "",
    price: "",
    category: "",
    attributesTable: [],
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const loadProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products/admin/${id}`, {
          signal: controller.signal,
        });
        setProduct({
          name: data.name || "",
          description: data.description || "",
          count: data.count ?? "",
          price: data.price ?? "",
          category: data.category || "",
          attributesTable: Array.isArray(data.attrs) ? data.attrs : [],
        });
      } catch (requestError) {
        if (controller.signal.aborted) return;
        const responseMessage =
          requestError.response?.data?.message || requestError.response?.data;
        setError(
          typeof responseMessage === "string"
            ? responseMessage
            : requestError.message || "Unable to load this product."
        );
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    loadProduct();
    return () => controller.abort();
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProduct(currentProduct => ({ ...currentProduct, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSaving(true);

    try {
      await axios.put(`/api/products/admin/${id}`, product);
      navigate("/admin/products");
    } catch (requestError) {
      const responseMessage =
        requestError.response?.data?.message || requestError.response?.data;
      setError(
        typeof responseMessage === "string"
          ? responseMessage
          : requestError.message || "Unable to update this product."
      );
    } finally {
      setSaving(false);
    }
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
          <h1>Edit product</h1>
          {error && <Alert variant="danger">{error}</Alert>}
          {loading ? (
            <p>Loading product...</p>
          ) : (
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="productName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  name="name"
                  required
                  value={product.name}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="productDescription">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  name="description"
                  required
                  as="textarea"
                  rows={3}
                  value={product.description}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="productCount">
                <Form.Label>Count in Stock</Form.Label>
                <Form.Control
                  name="count"
                  required
                  type="number"
                  min="0"
                  value={product.count}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="productPrice">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  name="price"
                  required
                  type="number"
                  min="0"
                  step="0.01"
                  value={product.price}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="productCategory">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  name="category"
                  required
                  value={product.category}
                  onChange={handleChange}
                />
              </Form.Group>

              <Button type="submit" variant="primary" disabled={saving}>
                {saving ? "Saving..." : "UPDATE"}
              </Button>
            </Form>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default AdminEditProductPage;
