import { useEffect, useState } from "react";
import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const AdminEditUserPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    lastName: "",
    email: "",
    isAdmin: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const loadUser = async () => {
      try {
        const { data } = await axios.get(`/api/users/${id}`, {
          signal: controller.signal,
        });
        setUser({
          name: data.name || "",
          lastName: data.lastName || "",
          email: data.email || "",
          isAdmin: Boolean(data.isAdmin),
        });
      } catch (requestError) {
        if (controller.signal.aborted) return;
        const responseMessage =
          requestError.response?.data?.message || requestError.response?.data;
        setError(
          typeof responseMessage === "string"
            ? responseMessage
            : requestError.message || "Unable to load this user."
        );
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    loadUser();
    return () => controller.abort();
  }, [id]);

  const handleChange = (event) => {
    const { name, value, checked, type } = event.target;
    setUser(currentUser => ({
      ...currentUser,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSaving(true);

    try {
      await axios.put(`/api/users/${id}`, user);
      navigate("/admin/users");
    } catch (requestError) {
      const responseMessage =
        requestError.response?.data?.message || requestError.response?.data;
      setError(
        typeof responseMessage === "string"
          ? responseMessage
          : requestError.message || "Unable to update this user."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center mt-5">
        <Col md={1}>
          <Link to="/admin/users" className="btn btn-info my-3">
            Go back
          </Link>
        </Col>
        <Col md={6}>
          <h1>Edit user</h1>
          {error && <Alert variant="danger">{error}</Alert>}
          {loading ? (
            <p>Loading user...</p>
          ) : (
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="userFirstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  name="name"
                  required
                  type="text"
                  value={user.name}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="userLastName">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  name="lastName"
                  required
                  type="text"
                  value={user.lastName}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="userEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  name="email"
                  required
                  type="email"
                  value={user.email}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="userIsAdmin">
                <Form.Check
                  name="isAdmin"
                  type="checkbox"
                  label="Is admin"
                  checked={user.isAdmin}
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

export default AdminEditUserPage;
