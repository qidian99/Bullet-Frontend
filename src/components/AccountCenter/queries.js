/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag';

export const RESTAURANT_QUERY = gql`
  query {
    getCurrUser {
      ... on Restaurant {
        restaurantId
        avatar
        restaurantName
        address
        signature
        tags
        deals {
          dealId
          status
          createdAt
          endedAt
          orders {
            orderId
            items {
              itemId
              price
              numOrdered
            }
          }
        }
        drivers {
          driverId
          email
          phone
          firstName
          lastName
          avatar
          confirmed
        }
        pickupLocations {
          locationId
          name
          alias
          startTime
          endTime
        }
        menuItems {
          itemId
          name
          imageUrl
          price
          courses
        }
      }
    }
  }
`;
