package net.bakseter.api.plugins

import com.auth0.jwk.JwkProviderBuilder
import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import io.ktor.server.application.Application
import io.ktor.server.application.install
import io.ktor.server.auth.Authentication
import io.ktor.server.auth.jwt.JWTPrincipal
import io.ktor.server.auth.jwt.jwt
import java.net.URL
import java.util.concurrent.TimeUnit

fun Application.configureAuthentication(devSecret: String, devAudience: String, devIssuer: String) {
    val issuer = "https://www.googleapis.com/oauth2/v3/certs"
    val jwkProvider = JwkProviderBuilder(URL(issuer))
        .cached(10, 24, TimeUnit.HOURS)
        .rateLimited(10, 1, TimeUnit.MINUTES)
        .build()

    install(Authentication) {
        jwt("auth-user") {
            realm = "User access."
            verifier(jwkProvider, issuer) {
                acceptLeeway(10)
                withIssuer("https://accounts.google.com")
            }
            validate {
                JWTPrincipal(it.payload)
            }
        }

        jwt("auth-cred") {
            realm = "User access, dev."
            verifier(
                JWT
                    .require(Algorithm.HMAC256(devSecret))
                    .withAudience(devAudience)
                    .withIssuer(devIssuer)
                    .build()
            )
            validate { credential ->
                if (credential.payload.getClaim("email").asString() != "") {
                    JWTPrincipal(credential.payload)
                } else {
                    null
                }
            }
        }
    }
}
