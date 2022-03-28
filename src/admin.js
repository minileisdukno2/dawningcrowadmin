import { useState, useEffect } from "react";

import "./admin.css";
const AdminPage = () => {
  const [api, setApi] = useState("my_work");
  const [myWorks, setMyWork] = useState([]);

  const [data, setData] = useState({
    id: null,
    image: "",
    title: "",
    price: "",
  });

  const handleChangeApi = (event) => {
    setApi(event.target.value);
    console.log(event.target.value);
  };

  useEffect(() => {
    fetch("http://localhost:3000/" + api)
      .then((res) => res.json())
      .then((resJson) => {
        setMyWork(resJson);
      });
  }, [api]);

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (!data.id) {
      handleCreateData();
    } else {
      handleEditData();
    }
  };

  const handleCreateData = () => {
    console.log(data);
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
    fetch("http://localhost:3000/" + api, options)
      .then((res) => res.json())
      .then((resJson) => {
        setMyWork((prev) => {
          return [...prev, resJson];
        });

        console.log(resJson);
      });
  };
  const handleOnchangeData = (event) => {
    setData((prev) => {
      return {
        ...prev,
        [event.target.name]: event.target.value,
      };
    });
  };

  const handleDelete = (id) => {
    console.log(id);
    const options = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    };
    fetch("http://localhost:3000/" + api + "/" + id, options)
      .then((res) => res.json())
      .then((resJson) => {
        setMyWork((prev) => {
          return prev.filter((item) => {
            return item.id !== id;
          });
        });
      });
  };

  const handleEditData = () => {
    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
    fetch("http://localhost:3000/" + api + "/" + data.id, options)
      .then((res) => res.json())
      .then((resJson) => {
        console.log(resJson);
        
        setMyWork((prev) => {
          return prev.map((item) => {
            if (item.id != data.id) {
              return item;
            } else {
                return resJson;
            }
          });
        });
        setData({
            id: null,
            image: "",
            title: "",
            price: "",
          });
      });
  };

  return (
    <div>
      <h1>Trang quản lí sản phẩm</h1>
      <div>
        <label>Thay đổi danh sách sản phẩm cần chỉnh sửa</label>
        <select onChange={handleChangeApi} value={api}>
          <option value="my_work">my_work</option>
          <option value="product">product</option>
          <option value="capynbara">capynbara</option>
        </select>
      </div>

      <h2>Danh sách sản phẩm</h2>
      <br />
      <div>
        <table>
          <tbody>
            <tr>
              <td>ID</td>
              <td>Tên sản phẩm</td>
              <td>Ảnh sản phẩm</td>
              <td>Giá sản phẩm</td>
              <td>Action</td>
              <td>Action</td>
            </tr>
          </tbody>

          <tbody>
            {myWorks.map((myWork) => {
              return (
                <tr key={myWork.id}>
                  <td>{myWork.id}</td>
                  <td>{myWork.title}</td>
                  <td>
                    <img src={myWork.image} />
                  </td>
                  <td>{myWork.price}</td>
                  <td
                    onClick={(event) => {
                      handleDelete(myWork.id);
                    }}
                  >
                    Xoa
                  </td>
                  <td
                    onClick={(event) => {
                      setData({
                        id: myWork.id,
                        title: myWork.title,
                        image: myWork.image,
                        price: myWork.price,
                      });
                    }}
                  >
                    Edit
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <form className="control" onSubmit={handleFormSubmit}>
        <input
          type="text"
          placeholder="Tên sản phẩm"
          name="title"
          value={data.title}
          onChange={handleOnchangeData}
        />
        <input
          type="text"
          placeholder="ảnh sản phẩm"
          name="image"
          value={data.image}
          onChange={handleOnchangeData}
        />
        <input
          type="number"
          placeholder="giá sản phẩm"
          name="price"
          value={data.price}
          onChange={handleOnchangeData}
        />
        <button>{data.id != null ? "Edit" : "Create"}</button>
      </form>
    </div>
  );
};
export default AdminPage;
