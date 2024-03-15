import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, message, Table, DatePicker } from 'antd';
import {
  UnorderedListOutlined,
  LineChartOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import Layout from './../components/Layout/Layout';
import axios from 'axios';
import Spinner from '../components/Layout/Spinner';
import moment from 'moment';
import Analytics from '../components/Layout/Analytics';

const { RangePicker } = DatePicker;

const Home = () => {
  const [showModal, setshowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allTransaction, setAllTransaction] = useState([]);
  const [frequency, setFrequency] = useState('7');
  const [selectedDate, setSelectedDate] = useState([]);
  const [type, setType] = useState('All');
  const [viewData, setViewData] = useState('table');
  const [editable, setEditable] = useState(null);

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      render: (text) => <span>{moment(text).format('DD-MM-YYYY')}</span>,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
    },
    {
      title: 'Type',
      dataIndex: 'type',
    },
    {
      title: 'Category',
      dataIndex: 'category',
    },
    {
      title: 'Actions',
      render: (text, record) => (
        <div>
          <EditOutlined
            onClick={() => {
              setEditable(record);
              setshowModal(true);
            }}
          />
          <DeleteOutlined
            className='mx-2'
            onClick={() => {
              handleDelete(record);
            }}
          />
        </div>
      ),
    },
  ];

  useEffect(() => {
    const getAllTransaction = async (req, res) => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        setLoading(true);
        const res = await axios.post('/api/v1/transactions/get-transaction', {
          userid: user._id,
          frequency,
          selectedDate,
          type,
        });
        setLoading(false);
        setAllTransaction(res.data);
        console.log(res.data);
      } catch (err) {
        console.log(err);
        message.error('Fetching issue with the Transaction');
      }
    };
    getAllTransaction();
  }, [frequency, selectedDate, type]);

  const handleDelete = async (record) => {
    try {
      setLoading(true);
      await axios.post('/api/v1/transactions/delete-transaction', {
        transactionId: record._id,
      });
      setLoading(false);
      message.success('Transaction deleted successfully');
    } catch (err) {
      setLoading(false);
      message.error('Unable to delete');
    }
  };

  const handleSubmit = async (values) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      setLoading(true);
      if (editable) {
        await axios.post('/api/v1/transactions/edit-transaction', {
          payload: {
            ...values,
            userId: user._id,
          },
          transactionId: editable._id,
        });
        setLoading(false);
        message.success('Transaction updated successfully');
      } else {
        await axios.post('/api/v1/transactions/add-transaction', {
          ...values,
          userid: user._id,
        });
        setLoading(false);
        message.success('Transaction added successfully');
      }
      setshowModal(false);
      setEditable(null);
    } catch (err) {
      setLoading(false);
      message.error('Failed to add transaction');
    }
  };
  return (
    <Layout>
      {loading && <Spinner />}
      <div className='filters'>
        <div>
          <h6>Select Frequnecy</h6>
          <Select value={frequency} onChange={(values) => setFrequency(values)}>
            <Select.Option value='7'>Last 1 Week </Select.Option>
            <Select.Option value='30'>Last 1 Month </Select.Option>
            <Select.Option value='365'>Last 1 Year </Select.Option>
            <Select.Option value='custom'>Custom</Select.Option>
          </Select>
          {frequency === 'custom' && (
            <RangePicker
              value={selectedDate}
              onChange={(values) => setSelectedDate(values)}
            />
          )}
        </div>
        <div>
          <h6>Select Type</h6>
          <Select value={type} onChange={(values) => setType(values)}>
            <Select.Option value='All'>ALL</Select.Option>
            <Select.Option value='Income'>INCOME</Select.Option>
            <Select.Option value='Expense'>EXPENSE</Select.Option>
          </Select>
        </div>
        <div className='icon-container'>
          <UnorderedListOutlined
            className={`mx-2 ${
              viewData === 'table' ? 'active-icon' : 'inactive-icon'
            }`}
            onClick={() => setViewData('table')}
          />
          <LineChartOutlined
            className={`mx-2 ${
              viewData === 'analytics' ? 'active-icon' : 'inactive-icon'
            }`}
            onClick={() => setViewData('analytics')}
          />
        </div>
        <div>
          <button
            className='btn btn-primary'
            onClick={() => setshowModal(true)}
          >
            Add New
          </button>
        </div>
      </div>
      <div className='content'>
        {viewData === 'table' ? (
          <Table columns={columns} dataSource={allTransaction} />
        ) : (
          <Analytics allTransaction={allTransaction} />
        )}
      </div>
      <Modal
        title={editable ? 'Edit Transaction' : 'Add Transaction'}
        open={showModal}
        onCancel={() => setshowModal(false)}
        footer={false}
      >
        <Form
          layout='vertical'
          onFinish={handleSubmit}
          initialValues={editable}
        >
          <Form.Item label='Amount' name='amount'>
            <Input type='text' />
          </Form.Item>
          <Form.Item label='Type' name='type'>
            <Select>
              <Select.Option value='Income'>Income</Select.Option>
              <Select.Option value='Expense'>Expense</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label='Category' name='category'>
            <Select>
              <Select.Option value='Medical'>Medical</Select.Option>
              <Select.Option value='Food'>Food</Select.Option>
              <Select.Option value='Transport'>Transport</Select.Option>
              <Select.Option value='Movie'>Movie</Select.Option>
              <Select.Option value='Friends'>Friends</Select.Option>
              <Select.Option value='Cashback'>Cashback</Select.Option>
              <Select.Option value='Stationary'>Stationary</Select.Option>
              <Select.Option value='Family'>Family</Select.Option>
              <Select.Option value='Work'>Work</Select.Option>
              <Select.Option value='Sports'>Sports</Select.Option>
              <Select.Option value='Others'>Others</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label='Date' name='date'>
            <Input type='date' />
          </Form.Item>
          <div className='d-flex justify-content-end'>
            <button type='submit' className='btn btn-primary'>
              SAVE
            </button>
          </div>
        </Form>
      </Modal>
    </Layout>
  );
};

export default Home;
