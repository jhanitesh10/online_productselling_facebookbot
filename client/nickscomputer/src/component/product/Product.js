import React, { Component } from "react";
import axios from "axios";
import Moment from "moment";

import Pagination from "../pagination/Pagination.js";

class Product extends Component {

  constructor(props) {
    super(props);
    this.state = {
      productDetail: [],
      totalDataCount: 0,
      offset: 0,
      limit: 10
    }
  }

  componentDidMount() {

    let offset = this.state.offset,
      limit = this.state.limit;

    axios.get(`http://localhost:1234/dashboard/productCount`)
    .then((userCountResponse) => {
        let userDetailCount = userCountResponse.data;

      axios.get(`http://localhost:1234/dashboard/productDetail?offset=${offset}&limit=${limit}`)
        .then((response) => {
          let productDetail = response.data;
          let totalDataCount = userDetailCount.length;


          this.setState({ productDetail: productDetail, totalDataCount: totalDataCount });
        })
        .catch((e) => {
          console.log("error while sending data to node platform", e);
        });

    })
    .catch((e) => {
      console.log("error while getting user count", e);
    });


  }

  hanldePagination(key) {
   
    let totalDataCount = this.state.totalDataCount;
    let limit = this.state.limit;
    let totalPage = Math.ceil(totalDataCount / limit);
    let offset = (limit) * (key - 1);

    axios.get(`http://localhost:1234/dashboard/productDetail?offset=${offset}&limit=${limit}`)
    .then((response) => {
        let productDetail = response.data;
        this.setState({ productDetail: productDetail });
    })
    .catch((e) => {
      console.log("error while sending data to node platform", e);
    });

  }

  handleAvailability(e, productId, available) {
    e.preventDefault();
    alert("hey");
    axios
      .get(`http://localhost:1234/dashboard/productAttribute/availibility?productId=${productId}&available=${available}`)
      .then((response) => {
        let orderDetailArray = response.data;

      })
      .catch((e) => {
        console.log("error while sending data to node platform", e);
      });

  }

  handleProductDelete(e, productId) {
    e.preventDefault();
    this.props.history.push('/dashboard/productattribute');
    axios
      .get(`http://localhost:1234/dashboard/product/delete?productId=${productId}`)
      .then((response) => {
        let orderDetailArray = response.data;

      })
      .catch((e) => {
        console.log("error while sending data to node platform", e);
      });
  }
  render() {

    let productDetail = this.state.productDetail;
    let currentDateTime = Moment().unix();
    let paginationDetail = this.state.paginationDetail;

    return (

        <div className="card">
        <div className="card-body">
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <div className="d-md-flex align-items-center">
                    <div>
                      <h4 className="card-title">Total product : {productDetail.length}</h4>
                      <h5 className="card-subtitle">
                        Overview of Top Selling Items
                      </h5>
                    </div>
                    <div className="ml-auto">
                      <div className="dl">
                        <select className="custom-select">
                          <option value="0" selected>
                            Monthly
                          </option>
                          <option value="1">Daily</option>
                          <option value="2">Weekly</option>
                          <option value="3">Yearly</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
          
            <div className="table-responsive m-t-20">
              <table className="table table-bordered  v-middle">
                <thead>
                  <tr className="bg-light">
                    <th className="border-top-0">Id</th>
                    <th className="border-top-0">Image</th>
                    <th className="border-top-0">Title</th>
                    <th className="border-top-0">Subtitle</th>
                    <th className="border-top-0">Price</th>
                    <th className="border-top-0">Discount</th>
                    <th className="border-top-0">ShippingCost</th>
                    <th className="border-top-0">ProductCount</th>
                    <th className="border-top-0">Stock</th>
                    <th className="border-top-0">ActiveStatus</th>
                    <th className="border-top-0">Trending</th>
                    <th className="border-top-0">Last Updated</th>
                    <th className="border-top-0">Availibility</th>
                    <th className="border-top-0">Delete</th>
                  </tr>
                </thead>

                {productDetail.map((data, index) =>

                <tbody>
                  <tr>
                    <td>
                      <div className="d-flex align-items-center">
                        <div>
                          <a className="btn btn-circle btn-info text-white">{data.id}</a>
                        </div>
                      </div>
                    </td>
                    <td width="40px">
                      <img className="img-thumbnail" src={data.image} />
                    </td>
                    <td>{data.title}</td>
                    <td>{data.subtitle}</td>
                    <td>₹{data.price}</td>
                    <td>{data.discount}%</td>
                    <td>₹{data.shipping_cost}</td>
                    <td>
                      <div className="">
                        <h4 className="m-b-0 font-16">{data.product_count}</h4>
                      </div>
                    </td>
                    <td>

                        {
                          (data.available) ? 
                          (<label className="label label-info">In Stock</label>) : (<label className="label label-danger">Out Stock</label>) 
                        }
                                                
                    </td>
                    <td>

                        {
                          (data.active_status) ?
                            (<label className="label label-info">Active</label>) : (<label className="label label-danger">Un-Active</label>)
                        }

                    </td>
                    <td>

                        {
                          (data.trending_status) ?
                            (<label className="label label-info">Trending</label>) : (<label className="label label-danger">Basic</label>)
                        }
                      
                    </td>

                    <td>
                      <label className="label label-primary">{Math.ceil((currentDateTime - data.updated_on) / (3600 * 24))} Days ago</label>
                    </td>
                    <td>
                     <button onClick={(e) => { this.handleAvailability(e, `${data.id}`, `${data.available}`) }} className="btn btn-danger">Toggle</button>
                    </td>
                    <td>
                      <button onClick={(e) => { this.handleProductDelete(e, `${data.id}`) }} className="btn btn-danger">Delete</button>
                    </td>
                  </tr>
                </tbody>

                )}

              </table>

              <Pagination data={this.state} handlePagination={this.hanldePagination.bind(this)}/>

            </div>
            </div>
            </div>
          </div>
        </div>
      </div>

    );
  }
}

export default Product;