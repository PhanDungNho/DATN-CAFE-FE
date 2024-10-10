// src/components/ListSize.jsx

import React, { Component } from 'react';
import { connect } from 'react-redux';
import AuthorityList from './AuthorityList';
import AuthorityForm from './AuthorityForm';
import {
    getSizes,
    updateSizeActive,
    insertSize,
    findSizeByNameContainsIgnoreCase,
    updateSize,
} from '../../../redux/actions/sizeAction';
import {
    Button,
    Col,
    Form,
    Input,
    Row,
    Skeleton,
    Modal,
} from 'antd';
import ContentHeader from '../common/ContentHeader';
import withRouter from '../../../helpers/withRouter';

export class ListSize extends Component {
    constructor(props) {
        super(props);

        this.state = {
            size: { id: "", name: "", active: true, customer: false, staff: false, director: false },
            open: false,
            query: '',
        };

        this.timeout = null;
    }

    componentDidMount = () => {
        this.props.getSizes();
        console.log('Component Mounted: Fetching sizes');
    };

    editSize = (value) => {
        this.setState({ size: value, open: true });
    };

    onSubmitForm = (values) => {
        const { size } = this.state;

        if (size.id) {
            this.props.updateSize(size.id, values);
            // You might have a separate action for updating size details
        } else {
            this.props.insertSize(values);
        }

        this.setState({ open: false });
    };

    handleSearch = (event) => {
        const query = event.target.value;
        this.setState({ query });

        clearTimeout(this.timeout);

        this.timeout = setTimeout(() => {
            if (query) {
                this.props.findSizeByNameContainsIgnoreCase(query);
            } else {
                this.props.getSizes();
            }
        }, 1500); // Reduced debounce time for better UX
    };

    openModal = () => {
        this.setState({ size: { id: "", name: "", active: true, customer: false, staff: false, director: false }, open: true });
    };

    closeModal = () => {
        this.setState({ open: false });
    };

    render() {
        const { sizes, isLoading, error } = this.props;
        const { open, query } = this.state;
        const { navigate } = this.props.router;

        // Sample data in case sizes are not loaded
        const sampleSizes = [
            { id: 1, name: 'Small', active: true, customer: true, staff: false, director: false },
            { id: 2, name: 'Medium', active: true, customer: false, staff: true, director: false },
            { id: 3, name: 'Large', active: false, customer: true, staff: true, director: true },
        ];

        const dataToDisplay = sizes && sizes.length > 0 ? sizes : sampleSizes;

        if (isLoading) {
            return (
                <>
                    <ContentHeader
                        navigate={navigate}
                        title="List Authorities"
                        className="site-page-header"
                    ></ContentHeader>
                    <Skeleton active />
                </>
            );
        }

        return (
            <>
                <ContentHeader
                    navigate={navigate}
                    title="List Authorities"
                    className="site-page-header"
                />

                <Row style={{ marginBottom: 10 }}>
                    <Col md={18}>
                        <Form layout="inline" name="searchForm" initialValues={{ query }}>
                            <Form.Item name="query">
                                <Input
                                    placeholder="Search authorities"
                                    value={query}
                                    onChange={this.handleSearch}
                                    allowClear
                                />
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>

                <AuthorityList
                    editSize={this.editSize}
                    sizes={dataToDisplay}
                    updateSizeActive={this.props.updateSizeActive}
                />

                <AuthorityForm
                    onSubmitForm={this.onSubmitForm}
                    isLoading={isLoading}
                    size={this.state.size}
                    onCancel={this.closeModal}
                    open={open}
                />
            </>
        );
    }
}

const mapStateToProps = (state) => ({
    sizes: state.sizeReducer.sizes,
    isLoading: state.sizeReducer.isLoading,
    error: state.sizeReducer.error,
});

const mapDispatchToProps = {
    getSizes,
    updateSizeActive,
    findSizeByNameContainsIgnoreCase,
    insertSize,
    updateSize,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(ListSize));
