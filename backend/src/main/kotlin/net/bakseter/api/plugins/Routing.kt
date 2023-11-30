package net.bakseter.api.plugins

import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import io.ktor.http.HttpStatusCode
import io.ktor.server.application.Application
import io.ktor.server.application.call
import io.ktor.server.response.respond
import io.ktor.server.routing.Route
import io.ktor.server.routing.get
import io.ktor.server.routing.routing
import net.bakseter.api.routes.v1.baseWeightsRoutesV1
import net.bakseter.api.routes.v1.jokerRoutesV1
import net.bakseter.api.routes.v1.workoutRoutesV1
import net.bakseter.api.routes.v2.baseWeightsRoutesV2
import net.bakseter.api.routes.v2.jokerRoutesV2
import net.bakseter.api.routes.v2.workoutRoutesV2
import java.util.Date

fun Application.configureRouting(dev: Boolean, devSecret: String, devAudience: String, devIssuer: String) {
    val authConfig = if (dev) "auth-cred" else "auth-user"

    routing {
        getStatus()
        getToken(dev = dev, secret = devSecret, audience = devAudience, issuer = devIssuer)
    }

    workoutRoutesV1(authConfig)
    baseWeightsRoutesV1(authConfig)
    jokerRoutesV1(authConfig)

    workoutRoutesV2(authConfig)
    baseWeightsRoutesV2(authConfig)
    jokerRoutesV2(authConfig)
}

fun Route.getStatus() {
    get("/status") { call.respond(HttpStatusCode.OK) }
}

fun Route.getToken(dev: Boolean, secret: String, audience: String, issuer: String) {
    get("/token/{email}") {
        if (!dev) {
            call.respond(HttpStatusCode.Forbidden, "Only available in dev environment! >:(")
            return@get
        }

        val email = call.parameters["email"]

        if (email == null) {
            call.respond(HttpStatusCode.BadRequest, "No email supplied")
            return@get
        }

        val token =
            JWT.create()
                .withAudience(audience)
                .withIssuer(issuer)
                .withClaim("email", email)
                .withExpiresAt(Date(System.currentTimeMillis() + (1000 * 60 * 60)))
                .sign(Algorithm.HMAC256(secret))

        call.respond(token)
    }
}
