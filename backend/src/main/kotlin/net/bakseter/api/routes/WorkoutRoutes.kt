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
import net.bakseter.api.schema.DateJson
import net.bakseter.api.schema.Workout
import net.bakseter.api.schema.WorkoutJson
import org.jetbrains.exposed.sql.and
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.select
import org.jetbrains.exposed.sql.transactions.transaction
import org.jetbrains.exposed.sql.update
import org.joda.time.DateTime

fun Application.workoutRoutes(authConfig: String) {
    routing {
        authenticate(authConfig) {
            getWorkout()
            putWorkout()
            getDate()
            putDate()
        }
    }
}

fun Route.getWorkout() {
    get("/workout") {
        val email = call.principal<JWTPrincipal>()?.payload?.getClaim("email")?.asString()?.lowercase()

        if (email == null) {
            call.respond(HttpStatusCode.Unauthorized)
            return@get
        }

        val cycle = call.request.queryParameters["cycle"]?.toIntOrNull()
        val week = call.request.queryParameters["week"]?.toIntOrNull()
        val day = call.request.queryParameters["day"]?.toIntOrNull()

        if (cycle == null || week == null || day == null) {
            call.respond(HttpStatusCode.BadRequest)
            return@get
        }

        val workout = transaction {
            Workout.select {
                Workout.email eq email and (Workout.cycle eq cycle and (Workout.week eq week and (Workout.day eq day)))
            }.firstOrNull()
        }

        if (workout == null) {
            call.respond(HttpStatusCode.NotFound)
            return@get
        }

        call.respond(
            HttpStatusCode.OK,
            WorkoutJson(
                workout[Workout.cycle],
                workout[Workout.week],
                workout[Workout.day],
                workout[Workout.reps],
            )
        )
    }
}

fun Route.putWorkout() {
    put("/workout") {
        val email = call.principal<JWTPrincipal>()?.payload?.getClaim("email")?.asString()?.lowercase()

        if (email == null) {
            call.respond(HttpStatusCode.Unauthorized)
            return@put
        }

        try {
            val workoutJson = call.receive<WorkoutJson>()

            val workout = transaction {
                Workout.select {
                    Workout.cycle eq workoutJson.cycle and (Workout.week eq workoutJson.week and (Workout.day eq workoutJson.day))
                }.firstOrNull()
            }

            if (workout == null) {
                transaction {
                    Workout.insert {
                        it[Workout.email] = email
                        it[cycle] = workoutJson.cycle
                        it[week] = workoutJson.week
                        it[day] = workoutJson.day
                        it[reps] = workoutJson.reps
                    }
                }

                call.respond(HttpStatusCode.OK)
                return@put
            }

            transaction {
                Workout.update({ Workout.cycle eq workoutJson.cycle and (Workout.week eq workoutJson.week and (Workout.day eq workoutJson.day)) }) {
                    it[reps] = workoutJson.reps
                }
            }

            call.respond(HttpStatusCode.Accepted)
        } catch (e: Exception) {
            e.printStackTrace()
            call.respond(HttpStatusCode.InternalServerError)
        }
    }
}

fun Route.putDate() {
    put("/workout/date") {
        val email = call.principal<JWTPrincipal>()?.payload?.getClaim("email")?.asString()?.lowercase()

        if (email == null) {
            call.respond(HttpStatusCode.Unauthorized)
            return@put
        }

        try {
            val dateJson = call.receive<DateJson>()

            val cycle = call.request.queryParameters["cycle"]?.toIntOrNull()
            val week = call.request.queryParameters["week"]?.toIntOrNull()
            val day = call.request.queryParameters["day"]?.toIntOrNull()

            if (cycle == null || week == null || day == null) {
                call.respond(HttpStatusCode.BadRequest)
                return@put
            }

            val workout = transaction {
                Workout.select {
                    Workout.email eq email and (Workout.cycle eq cycle and (Workout.week eq week and (Workout.day eq day)))
                }.firstOrNull()
            }

            if (workout == null) {
                transaction {
                    Workout.insert {
                        it[Workout.email] = email
                        it[Workout.cycle] = cycle
                        it[Workout.week] = week
                        it[Workout.day] = day
                    }
                }

                call.respond(HttpStatusCode.OK)
                return@put
            }

            transaction {
                Workout.update({ Workout.email eq email and (Workout.cycle eq cycle and (Workout.week eq week and (Workout.day eq day))) }) {
                    it[date] = DateTime(dateJson.date)
                }
            }

            call.respond(HttpStatusCode.Accepted)
        } catch (e: Exception) {
            e.printStackTrace()
            call.respond(HttpStatusCode.InternalServerError)
        }
    }
}

fun Route.getDate() {
    get("/workout/date") {
        val email = call.principal<JWTPrincipal>()?.payload?.getClaim("email")?.asString()?.lowercase()

        if (email == null) {
            call.respond(HttpStatusCode.Unauthorized)
            return@get
        }

        val cycle = call.request.queryParameters["cycle"]?.toIntOrNull()
        val week = call.request.queryParameters["week"]?.toIntOrNull()
        val day = call.request.queryParameters["day"]?.toIntOrNull()

        if (cycle == null || week == null || day == null) {
            call.respond(HttpStatusCode.BadRequest)
            return@get
        }

        val workout = transaction {
            Workout.select {
                Workout.email eq email and (Workout.cycle eq cycle and (Workout.week eq week and (Workout.day eq day)))
            }.firstOrNull()
        }

        val date = workout?.get(Workout.date)

        if (date == null) {
            call.respond(HttpStatusCode.NotFound)
            return@get
        }

        call.respond(
            HttpStatusCode.OK,
            DateJson(date.toString())
        )
    }
}
