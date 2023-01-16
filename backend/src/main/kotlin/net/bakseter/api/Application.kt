package net.bakseter.api

import io.ktor.server.application.Application
import io.ktor.server.netty.EngineMain
import net.bakseter.api.plugins.configureAuthentication
import net.bakseter.api.plugins.configureCORS
import net.bakseter.api.plugins.configureContentNegotiation
import net.bakseter.api.plugins.configureRateLimit
import net.bakseter.api.plugins.configureRouting
import java.net.URI

fun main(args: Array<String>) {
    EngineMain.main(args)
}

fun Application.module() {
    val databaseUrl = URI(environment.config.property("ktor.databaseUrl").getString())
    val migrateDb = environment.config.property("ktor.migrateDb").getString().toBooleanStrict()
    val dev = environment.config.property("ktor.dev").getString().toBooleanStrict()

    val devSecret = environment.config.property("jwt.devSecret").getString()
    val devAudience = environment.config.property("jwt.devAudience").getString()
    val devIssuer = environment.config.property("jwt.devIssuer").getString()

    DatabaseHandler(
        migrateDb,
        databaseUrl,
    ).init()

    configureAuthentication(devSecret = devSecret, devAudience = devAudience, devIssuer = devIssuer)
    configureCORS()
    configureContentNegotiation()
    configureRouting(dev = dev, devSecret = devSecret, devAudience = devAudience, devIssuer = devIssuer)
    // configureDocumentation()
    configureRateLimit()
}
