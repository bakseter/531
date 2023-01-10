package net.bakseter.routes

import io.ktor.http.HttpStatusCode
import io.ktor.server.application.Application
import io.ktor.server.application.call
import io.ktor.server.request.receive
import io.ktor.server.response.respond
import io.ktor.server.routing.Route
import io.ktor.server.routing.get
import io.ktor.server.routing.put
import io.ktor.server.routing.routing
import net.bakseter.schema.BaseWeights
import net.bakseter.schema.BaseWeightsJson
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.selectAll
import org.jetbrains.exposed.sql.transactions.transaction
import org.jetbrains.exposed.sql.update

fun Application.baseWeightsRoutes() {
    routing {
        getBaseWeights()
        putBaseWeights()
    }
}

fun Route.getBaseWeights() {
    get("/base-weights") {
        val baseWeights = transaction {
            BaseWeights.selectAll().firstOrNull()
        }

        if (baseWeights == null) {
            call.respond(HttpStatusCode.NotFound)
            return@get
        }

        call.respond(
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
        try {
            val baseWeightsJson = call.receive<BaseWeightsJson>()

            val baseWeights = transaction {
                BaseWeights.selectAll().firstOrNull()
            }

            if (baseWeights == null) {
                transaction {
                    BaseWeights.insert {
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
                BaseWeights.update {
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
