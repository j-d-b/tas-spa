import React from 'react';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';

import Box from '../../components/Box';
import { FlexBox } from '../../components/Flex';
import Grid from '../../components/Grid';

const UserLine = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 1fr);

  border-bottom: ${props => props.lastItem ? 'none' : '1px solid #aaa'};
  padding: 0.6rem;

  :hover {
    background-color: #eee;
  }
`;

const getUsers = gql`
  query users {
    users {
      name
      email
      role
      company
      companyType
      companyRegNum
      confirmed
      emailVerified
    }
  }
`;

const ConfirmButton = styled.button`
  cursor: pointer;
`;

const CONFIRM_USER = gql`
  mutation confirm($email: String!) {
    confirmUser(email: $email)
  }
`;

const RESEND_VERIFICATION = gql`
  mutation resend($email: String!) {
    sendVerifyEmailLink(email: $email)
  }
`;


const UserItem = ({ user }) => (
  <div>
    <UserLine>
      <div>{user.name}</div>
      <div>{user.email}</div>
      <div>{user.role}</div>
      <div>{user.company}</div>
      <div>{user.companyType}</div>
      <div>{user.companyRegNum}</div>
      <div>{user.confirmed ? '✔️' : (
        <Mutation mutation={CONFIRM_USER} onCompleted={() => console.log('sent')}>
          {(confirmUser, { error, data }) => (
            data ? '✔️' : <ConfirmButton onClick={() => confirmUser({ variables: { email: user.email }})}>Confirm</ConfirmButton>
          )}
        </Mutation>)}
      </div>
      <div>{user.emailVerified ?'✔️' : (
        <Mutation mutation={RESEND_VERIFICATION} onCompleted={() => console.log('sent')}>
          {(sendVerifyEmailLink, { error, data }) => (
            <ConfirmButton onClick={() => sendVerifyEmailLink({ variables: { email: user.email }})}>Resend</ConfirmButton>
          )}
        </Mutation>)}
      </div>
    </UserLine>
  </div>
);

const Users = () => (
  <Query query={getUsers}>
    {({ loading, error, data }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <p>{error.toString()}</p>;
      return data.users.map((user, i) => <UserItem key={user.email} user={user} lastItem={(i + 1) === data.users.length} /> );
    }}
  </Query>
);

export default () => (
  <Box width="calc(100% - 4rem)" mx="2rem" textAlign="center">
    <Grid cols="8">
      <div><strong>Name</strong></div>
      <div><strong>Email</strong></div>
      <div><strong>Role</strong></div>
      <div><strong>Company</strong></div>
      <div><strong>Company Type</strong></div>
      <div><strong>Company Reg. Number</strong></div>
      <div><strong>Confirmed</strong></div>
      <div><strong>Verified Email</strong></div>
    </Grid>
    <Users />
  </Box>
);