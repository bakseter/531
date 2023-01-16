package net.bakseter.api.routes

import io.ktor.http.HttpStatusCode
import io.ktor.server.application.Application
import io.ktor.server.application.call
import io.ktor.server.auth.authenticate
import io.ktor.server.auth.jwt.JWTPrincipal
import io.ktor.server.auth.principal
import io.ktor.server.request.receive
import io.ktor.server.response.respond
import io.ktor.server.routing.Route
import io.ktor.server.routing.get
import io.ktor.server.routing.put
import io.ktor.server.routing.routing
import net.bakseter.api.schema.BaseWeights
import net.bakseter.api.schema.BaseWeightsJson
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.select
import org.jetbrains.exposed.sql.transactions.transaction
import org.jetbrains.exposed.sql.update

fun Application.baseWeightsRoutes(authConfig: String) {
    routing {
        authenticate(authConfig) {
            getBaseWeights()
            putBaseWeights()
        }
    }
}

fun Route.getBaseWeights() {
    get("/base-weights") {
        val email = call.principal<JWTPrincipal>()?.payload?.getClaim("email")?.asString()?.lowercase()

        if (email == null) {
            call.respond(HttpStatusCode.Unauthorized)
            return@get
        }

        val baseWeights = transaction {
            BaseWeights.select { BaseWeights.email eq email }.firstOrNull()
        }

        if (baseWeights == null) {
            call.respond(HttpStatusCode.NotFound)
            return@get
        }

        call.respond(
            HttpStatusCode.OK,
            BaseWeightsJson(
                baseWeights[BaseWeights.dl],
                baseWeights[BaseWeights.bp],
                baseWeights[BaseWeights.sq],
                baseWeights[BaseWeights.op],
            )
        )
    }
}

fun Route.putBaseWeights() {
    put("/base-weights") {
        val email = call.principal<JWTPrincipal>()?.payload?.getClaim("email")?.asString()?.lowercase()

        if (email == null) {
            call.respond(HttpStatusCode.Unauthorized)
            return@put
        }

        try {
            val baseWeightsJson = call.receive<BaseWeightsJson>()

            val baseWeights = transaction {
                BaseWeights.select { BaseWeights.email eq email }.firstOrNull()
            }

            if (baseWeights == null) {
                transaction {
                    BaseWeights.insert {
                        it[BaseWeights.email] = email
                        it[dl] = baseWeightsJson.dl
                        it[bp] = baseWeightsJson.bp
                        it[sq] = baseWeightsJson.sq
                        it[op] = baseWeightsJson.op
                    }
                }

                call.respond(HttpStatusCode.OK)
                return@put
            }

            transaction {
                BaseWeights.update({ BaseWeights.email eq email }) {
                    it[dl] = baseWeightsJson.dl
                    it[bp] = baseWeightsJson.bp
                    it[sq] = baseWeightsJson.sq
                    it[op] = baseWeightsJson.op
                }
            }

            call.respond(HttpStatusCode.Accepted)
        } catch (e: Exception) {
            e.printStackTrace()
            call.respond(HttpStatusCode.InternalServerError)
        }
    }
}
