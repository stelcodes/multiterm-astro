---
title: "Part 1 - The OAuth Client"
published: 2025-07-25
draft: false
description: "Learning about the OAuth client from the authorization grant type"
tags: ["OAuth Series"]
---

This is a walk-through of the OAuth flow (authorization code grant type):

## Client Initialization
**1.1** The first step is for the client to get the client ID and client secret (if the client is confidential) from the authorization server. The client determines everything else, such as `redirect_uri` or `scope`.

**1.2** Once the client has the client ID and the client secret, the client needs to know how to talk to the **authorization server**. The client requires two endpoints:
* The **authorization endpoint** to get the authorization code, which the authorization server will send through the client's `redirect_uri`
* The **token endpoint** to get an authorization code if the authorization token is accepted.
  The client doesn't need to know anything about the server beyond that.

## Fetching the Authorization Code
**1.3** The user is redirected to the authorization server using the authorization endpoint `/authorize` to initiate the authorization process. The client adds the following parameters in the URL:
```javascript
{
    response_type: "code",
    client_id: client.client_id,
    redirect_uri: client.redirect_uris[0],
    state: state,
}
```
The redirect occurs by sending the HTTP code `302` to the browser. When the user is redirected to the authorization server via the authorization endpoint, the authorization server will ask the user if the client should be approved. If the client is approved, the user is redirected back to the client.

**1.3.1** At this point (when the authorization code is being requested), it is possible to add a state parameter to the URL as well.

## Fetching the Authorization Token
**1.4** When the user is redirected back to the client through the redirect_uri, which normally has a path like `/callback`, the client will read back the authorization code from the authorization server and use the authorization code to request the authorization token from the `/token` endpoint. The client will use the authorization code as a form parameter:
```javascript
var code = req.query.code;
{
	grant_type: "authorization_code",
	code: code,
	redirect_uri: "http://localhost:9000/callback",
}
```
**1.4.1** The authorization server will not use the `redirect_uri`; the client still includes it for added security, so an attacker can't specify a compromised redirect URI to inject an authorization code from one session to another. According to the OAuth specification, if the `redirect_uri` is specified in the authorization request, then the `redirect_uri` must also be specified in the token request.
**1.4.2** Some headers are also passed into the HTTP request to specify that this is a form-encoded request, and also to specify the client credentials to authorize the client:
```javascript
{
    "Content-Type": "application/x-www-form-urlencoded",
    Authorization:
      "Basic " +
      encodeClientCredentials(client.client_id, client.client_secret),
}
```
Some clients in the real world forego embedding the client credentials in the URL, but specifying them is necessary for full compliance with OAuth.

## Accessing a Protected Resource
**1.5** Once the client has the authorization token, the client will make a request to the protected resource. The token that we have now is called a `bearer token` and can be specified in the `Authorization` header. Can be specified in other places as well, but the `Authorization` header is recommended.

That is the entire OAuth flow. You now have access to the protected resource

## Going Further

**2.1** Adding a refresh token is possible in the above flow. The refresh token is mentioned in the OAuth 2.0 protocol. This can be done by sending the same request to the authorization server as in step 1.3

**2.2** Once the client receives the refresh token from the authorization server, it is then possible to request an access token by sending the same call as in step 1.4, but instead, changing the `grant_type`:
```javascript
{
	grant_type: 'refresh_token',
	refresh_token: refresh_token
}
```

**2.3** The authorization server might send back a `refresh_token` with the `access_token`, if that is the case, then the client must use that `refresh_token` going forward:
```javascript
//RESPONSE FROM AUTHORIZATION SERVER
{

"access_token": "IqTnLQKcSY62klAuNTVevPdyEnbY82PB",
"token_type": "Bearer",
"refresh_token": "j2r3oj32r23rmasd98uhjrk2o3i"
}
```

**2.3** The client cannot know if the token has expired. The authorization server can give a hint by providing an expiration date, but other than that, the only way to know would be to use it. A well-behaved client would throw out the token before the expiry. When the client requests a token a second time from the authorization server, the user is not prompted; instead, a refresh token is provided.

# References

- Token types, other than bearer token: https://curity.medium.com/the-different-token-types-and-formats-explained-19dd8b947b2e
