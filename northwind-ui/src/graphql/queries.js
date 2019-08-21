import { gql } from "apollo-boost";

const GET_ORDERS = gql`    
    {
        orders{
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

export { GET_ORDERS }