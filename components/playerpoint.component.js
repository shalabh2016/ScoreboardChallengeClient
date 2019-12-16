import React, { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import { useForm } from "react-form"
import { InputField } from './form/inputfield.component'
import DataTable from 'react-data-table-component'
import {SERVER_URL} from '../utils/server.config'

const PlayerPointComponent = () => {
    const [data, setData] = useState([]);
    const [dataError, setDataError] = useState('');
    const [loading, setLoading] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [responseError, setResponseError] = useState('');
    const [responseInfo, setResponseInfo] = useState('');

    const defaultValues = React.useMemo(
        () => ({
            PlayerName: "",
            Points: "",
        }),
        []
    );

    const {
        Form,
        meta: { isSubmitting, isSubmitted, canSubmit, error }
    } = useForm({
        defaultValues,
        debugForm: false,
        onSubmit: async (values, instance) => {

            let data = JSON.stringify({
                playerName: values.PlayerName,
                points: values.Points,
            });
            let axiosConfig = {
                headers: {
                    'Content-Type': 'application/json',
                }
            };
            axios
                .post(`${SERVER_URL}/PlayerPoint/AddNewPlayer`, data, axiosConfig)
                .then(response => {
                    setResponseInfo(response.data);
                    fetchUsers(1);
                })
                .catch(error => {
                    setResponseError("There is some error in addin the player information. Please try again.");
                });
        },
    });

    const columns = [
        {
            name: 'Player Name',
            selector: 'playerName',
            sortable: false,
        },
        {
            name: 'Points',
            selector: 'points',
            sortable: true,
        }
    ];
    const rowTheme = {
        header: {
            borderColor: 'transparent',
            fontWeight: 800,
            fontStyle: 'bold',
            fontSize: '24px'
        },
        rows: {
            spacing: 'spaced',
            spacingBorderRadius: '50px',
            spacingMargin: '3px',

            borderColor: 'rgba(0,0,0,.12)',
            backgroundColor: 'white',
            height: '52px',
        },
        cells: {
            cellPadding: '48px',
        },
        footer: {
            separatorStyle: 'none',
        },
    };
    const fetchUsers = async page => {
        setLoading(true);

        await axios.get(
            `${SERVER_URL}/PlayerPoint/GetPlayers/${page}/${perPage}`,
        ).then(response => {
            setData(response.data.data);
            setTotalRows(response.data.totalPlayers);
            setLoading(false);

        }).catch(error => { 
            setDataError("The data is not available or there is some error in request.");
            setLoading(false);
        });
    };

    const handlePageChange = page => {
        fetchUsers(page);
    };

    const handlePerRowsChange = async (newPerPage, page) => {
        setLoading(true);

        await axios.get(
            `${SERVER_URL}/PlayerPoint/GetPlayers/${page}/${newPerPage}`,
        ).then(response => {
            setData(response.data.data);
            setPerPage(newPerPage);
            setLoading(false);
        }).catch(error => {
            setDataError("The data is not available or there is some error in request.");
            setLoading(false);
         });


    };

    useEffect(() => {
        fetchUsers(1);
    }, []);

    return (
        <div className="col">
            <div className="row">
               { dataError ?  <div className="alert alert-danger"> <strong>{dataError}</strong>  </div> : <div className="col">
                    <DataTable
                        title=""
                        columns={columns}
                        data={data}
                        progressPending={loading}
                        pagination
                        paginationServer
                        paginationTotalRows={totalRows}
                        onChangeRowsPerPage={handlePerRowsChange}
                        onChangePage={handlePageChange}
                        customTheme={rowTheme}
                    />
                </div>}
            </div>
            <div className="row">
                <div className="col-12">
                    <hr />

                    <div className="card">
                        <div className="card-body">
                            <h3>Add new players.</h3>
                            {responseInfo ? <div className="alert alert-suuccess"> <strong>{responseInfo}</strong>  </div> : null}
                            {responseError ?
                                <div className="alert alert-danger"> <strong>{responseError}</strong>  </div>
                                : null}
                            <Form>
                                <div className="input-group mb-1">
                                    <InputField className="form-control"
                                        field="PlayerName"
                                        validate={value => (!value ? "Player name is Required" : false)}
                                        placeholder="Player Name" />
                                  
                                </div>
                                <div className="input-group mb-1">
                                    <InputField
                                        className="form-control"
                                        field="Points"
                                        validate={value => {
                                            if (!value) { return "Points are Required" }
                                            const regexp = new RegExp(`^-?[0-9]*$`);
                                            if (!regexp.test(value)) {
                                                return "Only integer values are accepted.";
                                            }
                                            return false;

                                        }}
                                        placeholder="Points" />
                                  
                                </div>

                                <div className="row">
                                    {isSubmitting ? (
                                        "Saving.."
                                    ) : (
                                            <div className="col">
                                                <button type="submit" disabled={!canSubmit} className="btn btn-primary btn-block">Save</button>
                                            </div>
                                        )}


                                </div>
                            </Form>
                        </div>
                    </div>
                    <hr/>
                </div>
            </div>
        </div>
    );
}


export default PlayerPointComponent