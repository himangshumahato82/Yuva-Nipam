import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Card,
    CardContent,
    Typography,
    TextField,
    Box,
    Grid2,
    Button,
} from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import PersonIcon from '@mui/icons-material/Person';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Popup } from '../layouts/Popup';
import LoaderSplash from '../layouts/LoaderSplash';

// Validation schema
const validationSchema = Yup.object({
    teacherCoordinatorName: Yup.string().required(
        "Name is required"
    ),
    teacherCoordinatorMobile: Yup.string()
        .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits")
        .required("Mobile number is required"),
    teacherCoordinatorEmail: Yup.string()
        .email("Invalid Email Address")
        .required("Email ID is required"),
});

const Dashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [data, setData] = useState([]);
    const [editIndex, setEditIndex] = useState(null);
    const [editableItem, setEditableItem] = useState(null);
    const [isLoading, setLoading] = useState(false);
    const textFieldStyles = {
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: '#BB86FC',
            },

            '&.Mui-focused fieldset': {
                borderColor: '#03DAC6',
            },
        },
        '& .MuiInputBase-input': {
            color: '#ffffff',
        },
        '& .MuiFormLabel-root': {
            color: '#BB86FC',
        },
        '& label.Mui-focused': {
            color: '#03DAC6',
        },
        '& .Mui-disabled': {
            '-webkit-text-fill-color': '#BBBBBB !important',
            color: '#BBBBBB',
        },
    };


    useEffect(() => {
        const fetchData = async () => {
            const schoolMail = location.state?.schoolMail || '';

            if (!schoolMail) {
                navigate('/unauthorized');
                return;
            }

            setLoading(true);

            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/participants/get-participants`, {
                    params: { schoolMail }
                });

                if (response.status === 200 && response.data && response.data.participants) {
                    const participants = response.data.participants.map(item => ({
                        _id: item._id,
                        affiliationNumber: item.affiliationNumber,
                        schoolName: item.schoolName,
                        teacherCoordinatorMobile: item.teacherCoordinatorMobile,
                        teacherCoordinatorName: item.teacherCoordinatorName,
                        teacherCoordinatorEmail: item.teacherCoordinatorEmail,
                        schoolMail: item.schoolMail
                    }));

                    setData(participants);
                } else {
                    // Handle case where the participants array is not found
                    Popup('error', 'Data Not Found', 'No participants data found for the provided school email.', 4000);
                    navigate('/unauthorized');
                }
            } catch (error) {
                // Handle error based on status codes or general error
                if (error.response?.status === 404) {
                    Popup('error', 'Not Found', 'No participants found or invalid request.', 4000);
                } else if (error.response?.status === 403) {
                    Popup('error', 'Unauthorized', 'You do not have permission to access this resource.', 4000);
                } else {
                    Popup('error', 'Something went wrong', error.response?.data?.message || 'An error occurred while fetching data.', 4000);
                }

                navigate('/notfound');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [location.state, navigate]);


    const handleRegisterAnother = () => {
        const schoolMail = location.state?.schoolMail || '';
        navigate('/register', { state: { schoolMail } });
    };

    const handleEdit = (index) => {
        setEditIndex(index);
        setEditableItem({ ...data[index] });
    };

    const handleSave = async (values) => {
        if (editIndex === null || editableItem === null) return;

        try {
            const id = data[editIndex]._id;
            const updatedFields = {
                teacherCoordinatorName: values.teacherCoordinatorName,
                teacherCoordinatorEmail: values.teacherCoordinatorEmail,
                teacherCoordinatorMobile: values.teacherCoordinatorMobile
            };

            setLoading(true);

            const response = await axios.patch(
                `${process.env.REACT_APP_API_URL}/participants/update-participants/${id}`,
                updatedFields
            );

            // Check if the response is successful
            if (response.status === 200) {
                // Update state with the new data
                const updatedData = response.data.participants.map((item) =>
                    item._id === id
                        ? {
                            ...item,
                            teacherCoordinatorName: values.teacherCoordinatorName,
                            teacherCoordinatorEmail: values.teacherCoordinatorEmail,
                            teacherCoordinatorMobile: values.teacherCoordinatorMobile,
                        }
                        : item
                );

                setData(updatedData);
                setEditIndex(null);
                setEditableItem(null);
                Popup('success', 'Success', 'Participant details updated successfully!', 4000);
            } else {
                Popup('error', 'Unexpected Response', 'Received an unexpected response from the server.', 4000);
            }
        } catch (error) {
            if (error.response?.status === 409) {
                Popup('error', 'Conflict', error.response?.data?.message || 'A participant with the same email or contact number already exists.', 4000);
            } else if (error.response?.status === 400) {
                Popup('error', 'Invalid Request', error.response?.data?.message || 'Invalid request format or data.', 4000);
            } else if (error.response?.status === 404) {
                Popup('error', 'Not Found', error.response?.data?.message || 'Participant does not exist.', 4000);
            } else {
                Popup('error', 'Something went wrong', error.response?.data?.message || 'Could not update participant details.', 4000);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = (resetForm) => {
        resetForm();
        setEditIndex(null);
        setEditableItem(null);
    };


    return (
        <>
            {isLoading && <LoaderSplash show={isLoading} />}
            <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: "#E3F2FD" }}>
                <Typography variant="h4" sx={{ padding: 4, mb: 2, textAlign: 'center', color: "#BBDEFB", fontSize: { xs: "2rem", sm: "3rem" }, backgroundColor: "#311B92" }}>
                    Welcome Back, {data[0]?.schoolName.split(',')[0].trim()}
                </Typography>
                <Box sx={{ padding: 2, flexGrow: 1, overflowY: 'auto' }}>
                    <Grid2 container spacing={2}>
                        {data.map((item, index) => {
                            const isEditing = editIndex === index;
                            return (
                                <Grid2 item size={{ xs: 12, sm: 6, lg: 4 }} key={index}>
                                    <Card
                                        sx={{
                                            border: "1px solid #ffffff22",

                                            boxShadow: "0 7px 20px 5px #00000088",
                                            borderRadius: ".7rem",
                                            backdropFilter: "blur(7px)",
                                            display: 'flex',
                                            alignItems: 'center',
                                            flexDirection: { xs: "column", sm: "row" },

                                            padding: 2,
                                            gap: 2,
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                padding: { xs: 1, sm: 4 },
                                                textAlign: 'center',
                                                borderRadius: 2,
                                                width: { xs: '100%', sm: '40%' },
                                                maxWidth: '200px',
                                                backgroundColor: '#fff8fc',
                                            }}
                                        >
                                            <Box sx={{ mb: 2 }}>
                                                <PersonIcon sx={{ width: "100%", fontSize: 120, color: '#BBDEFB' }} />

                                            </Box>
                                            <Box
                                                sx={{
                                                    padding: 1,
                                                    border: '1px solid #ccc',
                                                    borderRadius: 2,
                                                    backgroundColor: '#fff',
                                                    textAlign: 'center',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    height: "30px",
                                                }}
                                            >
                                                <Typography variant="body1" sx={{ textAlign: 'center', fontWeight: 'bold', padding: "15px", }}>
                                                    TEACHER
                                                </Typography>

                                            </Box>
                                        </Box>

                                        <CardContent sx={{
                                            width: '100%',
                                            padding: 0,
                                            '&:last-child': {
                                                paddingBottom: 0,
                                            },
                                            overflow: 'auto'
                                        }}>
                                            <Formik
                                                initialValues={{
                                                    teacherCoordinatorName: item.teacherCoordinatorName,
                                                    teacherCoordinatorEmail: item.teacherCoordinatorEmail,
                                                    teacherCoordinatorMobile: item.teacherCoordinatorMobile
                                                }}
                                                validationSchema={validationSchema}
                                                onSubmit={(values) => handleSave(values)}
                                            >
                                                {({ isSubmitting, resetForm }) => (
                                                    <Form>
                                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                                            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
                                                                <Typography variant="body1"  >
                                                                    Teacher Name:
                                                                </Typography>
                                                                <ErrorMessage name="teacherCoordinatorName" >
                                                                    {msg => <Typography color="error" fontSize={{ xs: '0.75rem', sm: '0.875rem' }}>{msg}</Typography>}
                                                                </ErrorMessage>
                                                            </Box>
                                                            <Field
                                                                as={TextField}
                                                                name="teacherCoordinatorName"
                                                                variant="outlined"
                                                                size="small"
                                                                fullWidth
                                                                disabled={!isEditing}
                                                                sx={textFieldStyles}
                                                            />
                                                            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
                                                                <Typography variant="body1" >
                                                                    Teacher Email:
                                                                </Typography>
                                                                <ErrorMessage name="teacherCoordinatorEmail" >
                                                                    {msg => <Typography color="error" fontSize={{ xs: '0.75rem', sm: '0.875rem' }}>{msg}</Typography>}
                                                                </ErrorMessage>
                                                            </Box>
                                                            <Field
                                                                as={TextField}
                                                                name="teacherCoordinatorEmail"
                                                                variant="outlined"
                                                                size="small"
                                                                fullWidth
                                                                disabled={!isEditing}
                                                                sx={textFieldStyles}
                                                            />
                                                            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
                                                                <Typography variant="body1" >
                                                                    Teacher Contact:
                                                                </Typography>
                                                                <ErrorMessage name="teacherCoordinatorMobile" >
                                                                    {msg => <Typography color="error" fontSize={{ xs: '0.75rem', sm: '0.875rem' }}>{msg}</Typography>}
                                                                </ErrorMessage>
                                                            </Box>
                                                            <Field
                                                                as={TextField}
                                                                name="teacherCoordinatorMobile"
                                                                variant="outlined"
                                                                size="small"
                                                                fullWidth
                                                                disabled={!isEditing}
                                                                sx={textFieldStyles}
                                                            />
                                                        </Box>
                                                        <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
                                                            {isEditing ? (
                                                                <Box sx={{ display: 'flex', gap: 9, justifyContent: "space-between" }}>

                                                                    <Button
                                                                        type="submit"
                                                                        variant="contained"
                                                                        startIcon={<EditIcon />}
                                                                        disabled={isSubmitting}
                                                                        color="success"
                                                                        sx={{ backgroundColor: "#3B79D7", border: "1px solid #093E8E", color: "white", width: { xs: '48%', sm: '45%' } }}
                                                                    >
                                                                        Save
                                                                    </Button>

                                                                    <Button
                                                                        variant="contained"
                                                                        onClick={() => handleCancel(resetForm)}
                                                                        color="error"
                                                                        sx={{ backgroundColor: "#F06F68", border: "1px solid #C54942", color: "white", width: { xs: '48%', sm: '45%' } }}
                                                                    >
                                                                        Cancel
                                                                    </Button>
                                                                </Box>
                                                            ) : (
                                                                <Button
                                                                    variant="contained"
                                                                    onClick={() => handleEdit(index)}
                                                                    startIcon={<EditIcon />}
                                                                    sx={{ backgroundColor: "#b730c2" }}
                                                                >
                                                                    Edit
                                                                </Button>
                                                            )}
                                                        </Box>
                                                    </Form>
                                                )}
                                            </Formik>
                                        </CardContent>
                                    </Card>
                                </Grid2>
                            );
                        })}
                        {/* Regular Add button for larger screens */}
                        <Grid2 item size={{ xs: 12, sm: 6, lg: 4 }} sx={{ display: { xs: 'none', md: 'block' } }}>
                            <Card
                                sx={{
                                    backdropFilter: 'blur(2rem)',
                                    borderRadius: ".7rem",
                                    backgroundColor: '#fff8fc',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    minHeight: "250px",
                                    height: '100%',
                                    cursor: 'pointer',
                                    border: '1px dashed #ddd',
                                    transition: 'background-color 0.3s ease',
                                    '&:hover': {
                                        backgroundColor: '#fff8fc',
                                    },
                                    boxShadow: "0 7px 20px 5px #00000088",
                                }}
                                onClick={handleRegisterAnother}
                            >
                                {/* Circular box around AddIcon */}
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        borderRadius: '50%',
                                        border: '3px solid black',
                                        width: 100, // Circle size
                                        height: 100, // Circle size
                                    }}
                                >
                                    <AddIcon sx={{ fontSize: 60 }} />
                                </Box>
                            </Card>
                        </Grid2>

                    </Grid2>
                </Box>
                {/* Floating Add Button for small screens */}
                <Box
                    sx={{
                        position: 'fixed',
                        bottom: 10,
                        right: 16,
                        display: { xs: 'block', sm: 'none' },
                        borderRadius: '50%',
                    }}
                >
                    <Button
                        variant="contained"
                        onClick={handleRegisterAnother}
                        sx={{
                            borderRadius: '50%',
                            backgroundColor: '#fff8fc',
                            width: 60,
                            height: 60,
                            border: '3px solid black',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        {/* AddIcon inside the button */}
                        <AddIcon sx={{ fontSize: 30, color: "black" }} />
                    </Button>
                </Box>

            </Box >
        </>
    );
};

export default Dashboard;
