package net.bakseter.api.plugins

import io.ktor.server.application.Application
import io.ktor.server.routing.route
import io.ktor.server.routing.routing
import net.bakseter.api.routes.v1.baseWeightsRoutesV1
import net.bakseter.api.routes.v1.basicRoutesV1
import net.bakseter.api.routes.v1.jokerRoutesV1
import net.bakseter.api.routes.v1.workoutRoutesV1
import net.bakseter.api.routes.v2.baseWeightsRoutesV2
import net.bakseter.api.routes.v2.basicRoutesV2
import net.bakseter.api.routes.v2.jokerRoutesV2
import net.bakseter.api.routes.v2.workoutRoutesV2

fun Application.configureRouting(
    dev: Boolean,
    devSecret: String,
    devAudience: String,
    devIssuer: String,
) {
    val authConfig = if (dev) "auth-cred" else "auth-user"

    routing {
        basicRoutesV1(dev = dev, secret = devSecret, audience = devAudience, issuer = devIssuer)
        workoutRoutesV1(authConfig)
        baseWeightsRoutesV1(authConfig)
        jokerRoutesV1(authConfig)

        route("/v1") {
            basicRoutesV1(dev = dev, secret = devSecret, audience = devAudience, issuer = devIssuer)
            workoutRoutesV1(authConfig)
            baseWeightsRoutesV1(authConfig)
            jokerRoutesV1(authConfig)
        }

        route("/v2") {
            basicRoutesV2(dev = dev, secret = devSecret, audience = devAudience, issuer = devIssuer)
            workoutRoutesV2(authConfig)
            baseWeightsRoutesV2(authConfig)
            jokerRoutesV2(authConfig)
        }
    }
}
