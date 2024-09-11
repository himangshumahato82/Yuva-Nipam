import React from 'react'
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import Yuvamanthan_Logo from "../Asset/YUVA_Logo.png";
import UGC_India_Logo from "../Asset/UGC_India_Logo.png";
import CBSE_Logo from "../Asset/CBSE_Logo.svg";
import Gov_Logo from "../Asset/Gov_Logo.png";
import IP_Logo from "../Asset/IP_Logo.jpeg";
import Kendriya_Logo from "../Asset/Kendriya_Logo.svg";
import NVS_Logo from "../Asset/NVS_Logo.png";
import * as Yup from "yup";
import axios from 'axios';
import { Popup } from "../layouts/Popup";
import { Box, Button, Grid2, TextField, Typography } from '@mui/material';
import AttributionImage from '../layouts/AttributionImage';

const SchoolInviteForm = ({ setLoading, schoolmail }) => {

    const navigate = useNavigate(); // Initialize useNavigate
    const validationSchema = Yup.object({
        affiliationNumber: Yup.string()
            .matches(/^[0-9]{5,7}$/, "Affiliation number must be 5-7 digits")
            .notRequired(),
        schoolName: Yup.string().required("School's name is required"),
        teacherCoordinatorName: Yup.string().required(
            "Name of Teacher Coordinator for the Event is required"
        ),
        teacherCoordinatorMobile: Yup.string()
            .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits")
            .required("Mobile number of Teacher Coordinator is required"),
        teacherCoordinatorEmail: Yup.string()
            .email("Invalid email address")
            .required("Email ID of Teacher Coordinator is required"),
    });

    const formik = useFormik({
        initialValues: {
            affiliationNumber: "",
            schoolName: "",
            teacherCoordinatorName: "",
            teacherCoordinatorMobile: "",
            teacherCoordinatorEmail: "",
            schoolMail: schoolmail,
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                setLoading(true);
                await axios.post(`${process.env.REACT_APP_API_URL}/participants/save-participants`, values);

                setLoading(false);
                Popup('success', 'Success', 'Participant registered successfully!', 4000);

                navigate("/dashboard", { state: { schoolMail: schoolmail } });
            } catch (error) {
                setLoading(false);

                // Check for specific status code and set appropriate messages
                if (error.response?.status === 409) {
                    Popup('error', 'Conflict', error.response?.data?.message || 'Participant with the provided email or mobile number is already registered.', 4000);
                } else {
                    Popup('error', 'Something went wrong', error.response?.data?.message || 'Could not save details.', 4000);
                }

                console.log(error);
            }
        },
        onReset: () => {
            console.log("Form reset!");
        },
    });

    const renderLabel = (label, isRequired = true) => (
        <>
            {label} {isRequired && <span style={{ color: "red" }}>*</span>}
        </>
    );

    return (
        <>
            {/* Unified Background Color for Logo and Title */}
            <Box
                sx={{
                    display: "flex",
                    gap: 4,
                    justifyContent: "space-between",
                    mb: 2,
                }}
            >
                <AttributionImage
                    src={IP_Logo}
                    alt="Intellectual Property India"
                    link="https://www.ipindia.gov.in/"
                    attributionContent="Image by Official Website (https://www.ipindia.gov.in/), used with permission."
                    width="100%"
                />
                <AttributionImage
                    src={Gov_Logo}
                    alt="Department for Promotion of Industry and Internal Trade"
                    link="https://dpiit.gov.in/"
                    attributionContent="Image by Official Indian Government Website, public domain."
                    width="100%"
                />
                <AttributionImage
                    src={Yuvamanthan_Logo}
                    alt="Yuvamanthan India"
                    link="https://www.yuvamanthan.org/"
                    attributionContent="Yuvamanthan logo, used under permission."
                    width="115px"
                />
            </Box>

            <form onSubmit={formik.handleSubmit} onReset={formik.handleReset} sx={{ mt: 4 }}>
                <Grid2 container spacing={2}>
                    {/* Affiliation Number */}
                    <Grid2 item size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            id="affiliationNumber"
                            name="affiliationNumber"
                            label={renderLabel("Affiliation Number", false)} // Pass false to remove the asterisk
                            value={formik.values.affiliationNumber}
                            onChange={formik.handleChange}
                            error={
                                formik.touched.affiliationNumber &&
                                Boolean(formik.errors.affiliationNumber)
                            }
                            helperText={
                                formik.touched.affiliationNumber &&
                                formik.errors.affiliationNumber
                            }
                            variant="outlined"
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    "& fieldset": {
                                        borderRadius: "8px",
                                    },
                                    "&:hover fieldset": {
                                        borderColor: "grey !important",
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderColor: "grey !important",
                                    },
                                },
                            }}
                        />
                    </Grid2>

                    {/* School's Name */}
                    <Grid2 item size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            id="schoolName"
                            name="schoolName"
                            label={renderLabel("School's Name")}
                            value={formik.values.schoolName}
                            onChange={formik.handleChange}
                            error={formik.touched.schoolName && Boolean(formik.errors.schoolName)}
                            helperText={formik.touched.schoolName && formik.errors.schoolName}
                            variant="outlined"
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    "& fieldset": {
                                        borderRadius: "8px",
                                    },
                                    "&:hover fieldset": {
                                        borderColor: "grey !important",
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderColor: "grey !important",
                                    },
                                },
                            }}
                        />
                    </Grid2>

                    {/* Teacher Coordinator's Name */}
                    <Grid2 item size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            id="teacherCoordinatorName"
                            name="teacherCoordinatorName"
                            label={renderLabel("Name of Teacher Coordinator for the Event")}
                            value={formik.values.teacherCoordinatorName}
                            onChange={formik.handleChange}
                            error={
                                formik.touched.teacherCoordinatorName &&
                                Boolean(formik.errors.teacherCoordinatorName)
                            }
                            helperText={
                                formik.touched.teacherCoordinatorName &&
                                formik.errors.teacherCoordinatorName
                            }
                            variant="outlined"
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    "& fieldset": {
                                        borderRadius: "8px",
                                    },
                                    "&:hover fieldset": {
                                        borderColor: "grey !important",
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderColor: "grey !important",
                                    },
                                },
                            }}
                        />
                    </Grid2>

                    {/* Teacher Coordinator's Mobile */}
                    <Grid2 item size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            id="teacherCoordinatorMobile"
                            name="teacherCoordinatorMobile"
                            label={renderLabel("Mobile Number of Teacher Coordinator")}
                            value={formik.values.teacherCoordinatorMobile}
                            onChange={formik.handleChange}
                            error={
                                formik.touched.teacherCoordinatorMobile &&
                                Boolean(formik.errors.teacherCoordinatorMobile)
                            }
                            helperText={
                                formik.touched.teacherCoordinatorMobile &&
                                formik.errors.teacherCoordinatorMobile
                            }
                            variant="outlined"
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    "& fieldset": {
                                        borderRadius: "8px",
                                    },
                                    "&:hover fieldset": {
                                        borderColor: "grey !important",
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderColor: "grey !important",
                                    },
                                },
                            }}
                        />
                    </Grid2>

                    {/* Teacher Coordinator's Email */}
                    <Grid2 item size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            id="teacherCoordinatorEmail"
                            name="teacherCoordinatorEmail"
                            label={renderLabel("Email ID of Teacher Coordinator")}
                            value={formik.values.teacherCoordinatorEmail}
                            onChange={formik.handleChange}
                            error={
                                formik.touched.teacherCoordinatorEmail &&
                                Boolean(formik.errors.teacherCoordinatorEmail)
                            }
                            helperText={
                                formik.touched.teacherCoordinatorEmail &&
                                formik.errors.teacherCoordinatorEmail
                            }
                            variant="outlined"
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    "& fieldset": {
                                        borderRadius: "8px",
                                    },
                                    "&:hover fieldset": {
                                        borderColor: "grey !important",
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderColor: "grey !important",
                                    },
                                },
                            }}
                        />
                    </Grid2>

                    {/* Submit and Reset Buttons */}
                    <Grid2 item size={{ xs: 12 }} sx={{ marginTop: "2%" }}>
                        <Grid2 container spacing={2} justifyContent="space-between">
                            <Grid2 item size={{ xs: 12 }}>
                                <Button
                                    color="secondary"
                                    variant="contained"
                                    fullWidth
                                    type="reset"
                                    sx={{ textTransform: "none", borderRadius: "8px", padding: "0.75rem 2rem" }}
                                >
                                    Reset
                                </Button>
                            </Grid2>
                            <Grid2 item size={{ xs: 4 }}>
                                <Button
                                    color="primary"
                                    variant="contained"
                                    fullWidth
                                    type="submit"
                                    sx={{ textTransform: "none", borderRadius: "8px", padding: "0.75rem 2rem" }}
                                >
                                    Submit
                                </Button>
                            </Grid2>
                        </Grid2>
                    </Grid2>
                </Grid2>



                {/* Technical issue note */}
                <Box mt={2}>
                    <Typography variant="body2" color="textSecondary" textAlign="center">
                        If you are facing any technical issue, feel free to contact at
                        +919210463129.
                    </Typography>
                </Box>
            </form>

            <Box
                sx={{
                    width: "100%",
                    padding: "0px",
                    display: "flex",
                    gap: 4,
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    mb: 2,
                    mt: "10px",
                }}
            >
                <AttributionImage
                    src={CBSE_Logo}
                    alt="Central Board of Secondary Education"
                    link="https://www.cbse.gov.in/cbsenew/cbse.html"
                    attributionContent="CBSC Logo (https://www.cbse.gov.in/cbsenew/cbse.html), used under fair use."
                    width="120px"
                />
                <AttributionImage
                    src={Kendriya_Logo}
                    alt="Kendriya Vidyalya"
                    link="https://kvsangathan.nic.in/"
                    attributionContent="Kendriya Vidyalaya logo, fair use."
                    width="120px"
                />
                <AttributionImage
                    src={NVS_Logo}
                    alt="Navodaya Vidyalaya Samiti"
                    link="https://navodaya.gov.in/nvs/nvs-school/Jajpur/en/home/"
                    attributionContent="NVS Logo (https://navodaya.gov.in/nvs/nvs-school/Jajpur/en/home/), public domain."
                    width="120px"
                />
                <AttributionImage
                    src={UGC_India_Logo}
                    alt="University Grants Commission India"
                    link="https://www.ugc.gov.in/"
                    attributionContent="By Official Website, Fair use, https://en.wikipedia.org/w/index.php?curid=20735401"
                    width="120px"
                />
            </Box>
        </>
    )
}

export default SchoolInviteForm