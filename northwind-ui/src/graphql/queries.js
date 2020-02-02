import { gql } from "apollo-boost";

const GET_ORDERS_COUNT = gql`    
    query {
        orders {
            customer{
                companyName
            }
            orderDetails{
            product{
                productName
                category{
                    categoryName
                }
            }
                quantity
            }
            employee{
                firstName
            }
            shipViaNavigation{
                companyName
            }
            orderDate
        }
    }
`;

const GET_ORDERS = gql`    
    query($index:Int, $size:Int) {
        orders(index:$index, size:$size){
            customer{
                companyName
            }
            orderDetails{
            product{
                productName
                category{
                    categoryName
                }
            }
                quantity
            }
            employee{
                firstName
            }
            shipViaNavigation{
                companyName
            }
            orderDate
        }
    }
`;

const GET_ORDERS_PAGE = gql`    
    query($index:Int!,$size:Int!) {
        ordersPage(index:$index, size:$size)
        {
            pageCount
            size
            totalCount
            items{
            orderId
            orderDate
            customer{
                companyName
            }
            orderDetails{
            product{
                productName
                category{
                    categoryName
                }
            }
                quantity
            }
            employee{
                firstName
            }
            shipViaNavigation{
                companyName
            }
            }
        }
    }
`;

const AUTH_USER = gql`
  mutation authenticate($input: newUser!) {
    authenticate(input: $newUser)
      @rest(type: "User", path: "/users/authenticate", method: "POST", endpoint: "auth") {
      userName            
      id
      token
    }
  }
`;

export { GET_ORDERS, GET_ORDERS_PAGE, GET_ORDERS_COUNT }