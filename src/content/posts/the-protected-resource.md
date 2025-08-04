---
title: "Part 2 - The OAuth Protected Resource"
published: 2025-07-31
draft: false
description: "Learning about the protect resource from the OAuth authorization grant type"
tags: ["OAuth Series"]
---

This is a deep dive into the inner workings of a Protected Resource that an OAuth client can call.

## Parsing the Token

**1** The first step is for the protected resource to parse the authorization token. The authorization token is sent to the protected resource as a Bearer token. According to the [OAuth bearer token usage specification](https://tools.ietf.org/html/rfc6750), the bearer token can be passed to the protected resource in 3 different ways:
- The HTTP Authorization header
- Inside a form-encode POST body
- A query parameter

**1.1** The best method is to pass the token through the HTTP Authorization header because it has the least chance of being logged or leaked.

## Validating the Token

**1** To simplify things, we will assume that the authorization server and the protected resource share the same database. When the authorization server creates a new token, the authorization server will store the token in the shared database.</br>
Then, when a protected resource receives a token from a client, the protected resource can look up the shared database to validate the token. 

**2** For example, if the authorization server is using a NoSQL database, then the stored JSON object would look like this with the scope and client who requested the token:
```json
{
"access_token": "s9nR4qv7qVadTUssVD5DqA7oRLJ2xonn",
"clientId": "oauth-client-1",
"scope": ["foo"]
}
```

## Using the Token Scope to Serve Content

**1** What if you had multiple protected resources and one authorization server? This is usually the case. It would be nice if the client could request one token from the authorization server and use it across different authorization servers. Each protected resource would first check if the token is valid, and then check if it has the relevant scope. A specific authorization server would only check that the scope is relevant for itself. The authorization server does not care if other scopes are defined.</br>
If the scope is absent, an error can be returned with the header `WWW-Authenticate`, telling the client that the resource requires a Bearer token and a particular scope.

A significant benefit of this setup is that the client does not have to call multiple API endpoints when you have a complex set of structured information and want to give access to subsets of data.

Another benefit is that it does not matter who the user is. The protected resource does not validate the user behind the authorization token. It only cares about the authorization token and the scopes attached to it. This is a very common approach for API design because it allows a client to call a single URL without knowing who the user is, yet still receive individualized results. This protects the user's privacy. The critically minded might ask how the protected resource could display user-specific information if it does not care about the user behind the token.</br>
The answer lies in the authorization token. The authorization token has all the information the protected resource needs for user-specific information. For example, when the user is being authenticated on the authorization server, the authorization server can add a `user` value when it eventually issues a token to a client. Like so:

```json
{
"access_token": "s9nR4qv7qVadTUssVD5DqA7oRLJ2xonn",
"clientId": "oauth-client-1",
"scope": ["foo"],
"user": "Lisa"
}
```

## Other Access Controls
As mentioned above, accessing the user's name from the authorization token is just one method among many for controlling access to a protected resource. This flexibility can occur because OAuth stays out of the decision-making process of granting access and acts as a carrier of authorization information by using tokens and scopes. It is up to the protected resource what it wants to do with the information the OAuth authorization flow provides.
