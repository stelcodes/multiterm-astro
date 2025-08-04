---
title: "Part 3 - The OAuth Authorization Server"
published: 2025-08-01
draft: false
description: "Learning about the OAuth Authorization Server from the authorization grant type"
tags: ["OAuth Series"]
---

## 1 Introduction

**1.1** In this section, there will be a deep dive into the Authorization server. An authorization server that supports the authorization code grant type has the following features:
- Registers clients.
- Performs the delegation action core to OAuth.
- Issues tokens to clients.
- Authenticates users.

Because of the vast amount of features the authorization server must support, it is arguably the most complex component in the OAuth ecosystem.

**1.2** In the OAuth protocol, most complexity is pushed to the authorization server because authorization servers are the fewest in number. This means there are many more clients than protected resources, and there are many more protected resources than authorization servers.

## 2 Registering a Client

**2.1** The simplest form of managing clients on the authorization server is static registration. This means the authorization server predefines all the unique client identifiers (client IDs) needed for all clients that connect to the authorization server. The clients would be stored in a database on a production-level authorization server.

**2.2** Once the client IDs are defined, the authorization server generates a client secret for each client. This secret is also stored in the database for production-level authorization servers.

**2.3** The final step in registering a client is to define a redirect URI. Unlike the client ID and the client secret, the authorization server does not generate the redirect URI. The client provides the redirect URI.

At the end of the client registration process, the authorization server would have a client object like this:
```javascript
var clients = [
	{
		"client_id": "oauth-client-1",
		"client_secret": "oauth-client-secret-1",
		"redirect_uris": ["http://client-server:9000/callback"],
	}
];
```

## 3 Authorizing a Client

**3.1** As discussed, the authorization server needs to authorize the client on behalf of the user so the client can receive an authorization code. This communication is done over the front channel, which needs to be reachable by the user's browser. Since most authorization servers are web servers, the authorization endpoint typically has the `/authorize` path and is always a `GET` request.

**3.2** Firstly, when the `/authorize` endpoint is called, the authorization server finds out which client made the request. Normally, the client passes its identifier in the `client_id` parameter and its redirect URI in the `redirect_uri` parameter.

**3.3** Once the client ID has been found, the authorization server must determine if the client exists in its database of predefined clients. If the client does not, an error is emitted such as `{error: 'Unknown client'}`. A classic check is to see if the `client_id` and `redirect_uri` match what is already stored in the database. Since only checking the `client_id` could lead to security gaps, all the current communication is being done on the public front channel.

According to the OAuth specification, a client can register multiple redirect URIs to itself, allowing the client to be served from different URLs in different circumstances. This can complicate the client authorization process.

**3.4** Finally, when the client is authorized, the user is prompted to give the client the relevant permissions to access the protected resource and act on behalf of the user.

:::warning
:warning:</br>
The OAuth protocol does not care if the user is **authenticated** when the authorization server prompts the user to authorize the client. User authentication is completely outside the scope of OAuth. This is why adequate care is required to supply user authentication at this stage.</br>
:warning:
:::

**3.5**
