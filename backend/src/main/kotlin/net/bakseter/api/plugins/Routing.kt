package net.bakseter.api.plugins

import io.ktor.http.HttpStatusCode
import io.ktor.server.application.Application
import io.ktor.server.application.call
import io.ktor.server.response.respond
import io.ktor.server.routing.Route
import io.ktor.server.routing.get
import io.ktor.server.routing.routing
import net.bakseter.api.routes.baseWeightsRoutes
import net.bakseter.api.routes.workoutRoutes

fun Application.configureRouting() {
    routing { getStatus() }

    workoutRoutes()
    baseWeightsRoutes()
}

fun Route.getStatus() {
    get("/status") { call.respond(HttpStatusCode.OK) }
}
